const fs = require('fs').promises
const path = require('path')
const AzeritePowers = require('../../src/assets/wow-data/AzeritePower.json')
const ClassSpec = require('../../src/assets/wow-data/ClassSpec.json')

if (!fs) throw new Error('You must use a node version containing fs.promises! i.e node >= 10')

const simulations = {
  azeritelevels: {
    simulationType: 'azeritelevels',
    order: 1,
    template: 'azerite-levels'
  },
  azeritestacks: {
    simulationType: 'azeritestacks',
    order: 2,
    template: 'azerite-stacks'
  },
  combinator: {
    simulationType: 'combinations',
    order: 3,
    template: 'combinations'
  },
  racesimulation: {
    simulationType: 'races',
    order: 5,
    template: 'races'
  },
  trinketsimulation: {
    simulationType: 'trinkets',
    order: 4,
    template: 'trinkets'
  }
}

const wowClasses = {}

module.exports.onCreateNode = async function ({ node, getNode, actions }) {
  const { createNodeField, deleteNode } = actions

  // Prevents non reports files to be processed
  if (node.sourceInstanceName !== 'reports') return
  // Prevents directories to be processed
  if (node.internal.type !== 'File') return
  // Delete unwanted node from reports (things like .DS_Store)
  if (node.extension !== 'json') {
    deleteNode({ node })
    return
  }

  // Example file: 'reports/TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation.json'

  // 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
  const name = node.name
  // ['trinketsimulation', '1t', 't21', 'death-knight', 'frost', 'cold-heart-runic-attenuation']
  const [simulationName, fightStyle, tier, wowClass, spec, variation] = name.toLowerCase().split('_')
  // 'trinkets', 4
  const { simulationType, order, template } = simulations[simulationName]
  // '/death-knight/trinkets/1t-t21-frost
  let slug = `/${wowClass}/${simulationType}/${fightStyle}-${tier}-${spec}`
  if (variation) slug += `-${variation}`

  // slug: '/death-knight/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
  createNodeField({ node, name: 'slug', value: slug })
  // name: 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
  createNodeField({ node, name: 'name', value: name })
  // wowClass: 'death-knight'
  createNodeField({ node, name: 'wowClass', value: wowClass })
  // simulationType: 'trinkets'
  createNodeField({ node, name: 'simulationType', value: simulationType })
  // order: 4
  createNodeField({ node, name: 'order', value: order })
  createNodeField({ node, name: 'template', value: template })
  // template: 'trinkets'
  // tier: 't21'
  createNodeField({ node, name: 'tier', value: tier })
  // fightStyle: '1t'
  createNodeField({ node, name: 'fightStyle', value: fightStyle })
  // spec: 'frost'
  createNodeField({ node, name: 'spec', value: spec })
  // variation: 'cold-heart-runic-attenuation' (optional, if it doesn't exist then it's an empty string '')
  createNodeField({ node, name: 'variation', value: variation || '' })

  // Register the wow class to create the corresponding index page if it's the first time we meet it
  if (!wowClasses[wowClass]) wowClasses[wowClass] = true

  // Get the metas from the file
  let report
  try {
    const jsonFile = await fs.readFile(node.absolutePath, { encoding: 'utf8', flag: 'r' })
    report = JSON.parse(jsonFile)
  } catch (err) {
    console.error(`Error while processing the '${name}' report:`, err)
    return
  }
  const { metas } = report
  const optionsDbc = metas.options.dbc
  const versionUsed = optionsDbc[optionsDbc['version_used']]
  createNodeField({ node, name: 'targetError', value: metas.options['target_error'] })
  createNodeField({ node, name: 'resultTime', value: metas['result_timestamp'] })
  createNodeField({ node, name: 'version', value: versionUsed['wow_version'] })
  createNodeField({ node, name: 'build', value: versionUsed['build_level'] })
  createNodeField({ node, name: 'buildTime', value: metas['build_timestamp'] })
  createNodeField({ node, name: 'gitRevision', value: metas['git_revision'] || '' })
  createNodeField({ node, name: 'templateDPS', value: Math.round(metas.player['collected_data'].dps.mean) })

  switch (simulationType) {
    case 'azeritelevels':
    case 'azeritestacks':
      const { results } = report
      // Build the powers array
      const powers = []
      for (let i = 1; i < results.length; i++) {
        const value = results[i]
        // Some labels are concatened, like the Alliance / Horde one, we split them
        const spellNames = value.shift().split(' / ')
        // Insert each power (powerId and meanDPS)
        for (const spellName of spellNames) {
          const { powerId } = AzeritePowers[spellName]
          const totalDPS = value.reduce((accumulator, currentValue) => accumulator + currentValue)
          powers.push({ powerId, meanDPS: totalDPS / value.length })
        }
      }
      // Descending sort using meanDPS
      powers.sort((a, b) => b.meanDPS - a.meanDPS)
      // Compute the weights
      const bestPower = powers[0]
      bestPower.weight = 10 // Defined by the addon as reference
      for (let i = 1; i < powers.length; i++) {
        const power = powers[i]
        // Compute the weight relatively to the best power
        power.weight = (power.meanDPS / bestPower.meanDPS * bestPower.weight).toFixed(2)
      }
      // Create the weightsString
      const classSpec = ClassSpec[wowClass]
      const classId = classSpec.classId
      const specId = classSpec.specIds[spec]
      const weigts = powers.map(({ powerId, weight }) => `${powerId}=${weight}`)
      const weightsName = `herodamage.com - ${simulationType === 'azeritelevels' ? 'Levels' : 'Stacks'}_${fightStyle.toUpperCase()}_${tier.toUpperCase()}`
      const weightsString = `( AzeritePowerWeights:1:"${weightsName}":${classId}:${specId}: ${weigts.join(', ')} )`
      createNodeField({ node, name: 'azeritePowerWeights', value: weightsString })
      break
  }
}

module.exports.createPages = async function ({ graphql, actions }) {
  const { createPage } = actions

  // Make the class index pages by iterating over discovered classes during onCreateNode
  Object.keys(wowClasses).forEach((wowClass) => {
    const slug = `/${wowClass}/`
    createPage({
      path: slug,
      component: path.resolve('./src/templates/wow-class.js'),
      context: { slug, wowClass }
    })
  })

  // Makes the simulations pages
  const result = await graphql(`
    {
      allFile(filter: {sourceInstanceName: {eq: "reports"}}) {
        edges {
          node {
            fields {
              slug
              name
              wowClass
              simulationType
              order
              template
              tier
              fightStyle
              spec
              variation
              targetError
              resultTime
              version
              build
              buildTime
              gitRevision
              templateDPS
              azeritePowerWeights
            }
          }
        }
      }
    }
  `)
  const { allFile } = result.data
  if (allFile) {
    allFile.edges.forEach(({ node }) => {
      const fields = node.fields
      createPage({
        path: fields.slug,
        component: path.resolve(`./src/templates/simulation/${fields.template}.js`),
        context: fields
      })
    })
  }
}
