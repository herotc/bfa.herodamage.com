import { promisify } from 'util'
import { readFile } from 'fs'
import { resolve } from 'path'
import { getAzeriteInformation, getWowClassIdAndSpecId } from '../../src/utils/wow/core'

// Until we get promisified version from fs (promises API is still experimental)
const readFilePromise = promisify(readFile)

const simulations = {
  'azerite-levels': {
    simulationFeaturedOrder: 1,
    simulationCategory: 'azerite',
    simulationType: 'azerite-levels',
    simulationTemplate: 'azerite-levels'
  },
  'azerite-stacks': {
    simulationCategory: 'azerite',
    simulationType: 'azerite-stacks',
    simulationTemplate: 'azerite-stacks'
  },
  'combinator-0a': {
    simulationCategory: 'combinations',
    simulationType: 'combinations-0a',
    simulationTemplate: 'combinations'
  },
  'combinator-1a': {
    simulationCategory: 'combinations',
    simulationType: 'combinations-1a',
    simulationTemplate: 'combinations'
  },
  'combinator-2a': {
    simulationCategory: 'combinations',
    simulationType: 'combinations-2a',
    simulationTemplate: 'combinations'
  },
  'combinator-3a': {
    simulationFeaturedOrder: 3,
    simulationCategory: 'combinations',
    simulationType: 'combinations-3a',
    simulationTemplate: 'combinations'
  },
  racesimulation: {
    simulationFeaturedOrder: 4,
    simulationCategory: 'races',
    simulationType: 'races',
    simulationTemplate: 'races'
  },
  trinketsimulation: {
    simulationFeaturedOrder: 2,
    simulationCategory: 'trinkets',
    simulationType: 'trinkets',
    simulationTemplate: 'trinkets'
  }
}

// Hold all the additionnal pages to create
const wowClasses = []
const simulationNames = []
const fightStyles = []
const tiers = []

export const onCreateNode = async ({ node, getNode, actions }) => {
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
  const { simulationFeaturedOrder, simulationCategory, simulationType, simulationTemplate } = simulations[simulationName]
  // '/death-knight/trinkets/1t-t21-frost
  let slug = `/${wowClass}/${simulationType}/${fightStyle}-${tier}-${spec}`
  if (variation) slug += `-${variation}`

  // slug: '/death-knight/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
  createNodeField({ node, name: 'slug', value: slug })
  // name: 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
  createNodeField({ node, name: 'name', value: name })
  // wowClass: 'death-knight'
  createNodeField({ node, name: 'wowClass', value: wowClass })
  // simulationFeaturedOrder: 2
  if (simulationFeaturedOrder) {
    createNodeField({ node, name: 'simulationFeaturedOrder', value: simulationFeaturedOrder })
  }
  // simulationCategory: 'trinkets'
  createNodeField({ node, name: 'simulationCategory', value: simulationCategory })
  // simulationType: 'trinkets'
  createNodeField({ node, name: 'simulationType', value: simulationType })
  // simulationTemplate: 'trinkets'
  createNodeField({ node, name: 'simulationTemplate', value: simulationTemplate })
  // fightStyle: '1t'
  createNodeField({ node, name: 'fightStyle', value: fightStyle })
  // tier: 't21'
  createNodeField({ node, name: 'tier', value: tier })
  // spec: 'frost'
  createNodeField({ node, name: 'spec', value: spec })
  // variation: 'cold-heart-runic-attenuation' (optional, if it doesn't exist then it's an empty string '')
  createNodeField({ node, name: 'variation', value: variation || '' })

  // Register the wow class / simulation name / fight style / tier to create the corresponding pages
  if (!wowClasses.includes(wowClass)) wowClasses.push(wowClass)
  if (!simulationNames.includes(simulationName)) simulationNames.push(simulationName)
  if (!fightStyles.includes(fightStyle)) fightStyles.push(fightStyle)
  if (!tiers.includes(tier)) tiers.push(tier)

  // Get the metas from the file
  let report
  try {
    const jsonFile = await readFilePromise(node.absolutePath, { encoding: 'utf8', flag: 'r' })
    report = JSON.parse(jsonFile)
  } catch (err) {
    console.error(`Error while processing the '${name}' report:`, err)
    return
  }
  const { metas } = report
  createNodeField({ node, name: 'fightLength', value: metas.fightLength })
  createNodeField({ node, name: 'fightLengthVariation', value: metas.fightLengthVariation })
  createNodeField({ node, name: 'targetError', value: metas.targetError })
  createNodeField({ node, name: 'templateGear', value: metas.templateGear })
  createNodeField({ node, name: 'templateTalents', value: metas.templateTalents })
  createNodeField({ node, name: 'templateDPS', value: metas.templateDPS })
  createNodeField({ node, name: 'elapsedTime', value: metas.elapsedTime })
  createNodeField({ node, name: 'totalEventsProcessed', value: metas.totalEventsProcessed })
  createNodeField({ node, name: 'totalIterations', value: metas.totalIterations })
  createNodeField({ node, name: 'totalActors', value: metas.totalActors })
  createNodeField({ node, name: 'simcBuildTimestamp', value: metas.simcBuildTimestamp })
  createNodeField({ node, name: 'simcGitRevision', value: metas.simcGitRevision || '' })
  createNodeField({ node, name: 'wowVersion', value: metas.wowVersion })
  createNodeField({ node, name: 'wowBuild', value: metas.wowBuild })

  // AzeritePowerWeights Import String
  switch (simulationType) {
    case 'azerite-levels':
    case 'azerite-stacks':
      const { results } = report
      // Build the powers array
      const powers = []
      for (let i = 1; i < results.length; i++) {
        const value = results[i]
        // Split up the variations, those aren't supported by the addons atm
        const parts = value.shift().split(' -- ')
        // Some labels are concatened, like the Alliance / Horde one, we always take the first one
        const spellNames = parts[0].split(' / ')
        // Insert each power (powerId and meanDPS)
        for (const spellName of spellNames) {
          const { powerId } = getAzeriteInformation(spellName)
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
      const { classId, specId } = getWowClassIdAndSpecId(wowClass, spec)
      const weigts = powers.map(({ powerId, weight }) => `${powerId}=${weight}`)
      const weightsName = `herodamage.com - ${simulationType === 'azeritelevels' ? 'Levels' : 'Stacks'}_${fightStyle.toUpperCase()}_${tier.toUpperCase()}`
      const weightsString = `( AzeritePowerWeights:1:"${weightsName}":${classId}:${specId}: ${weigts.join(', ')} )`
      createNodeField({ node, name: 'azeritePowerWeights', value: weightsString })
      break
  }
}

export const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Class index
  wowClasses.forEach((wowClass) => {
    const slug = `/${wowClass}/`
    createPage({
      path: slug,
      component: resolve('./src/templates/wow-class.js'),
      context: { slug, wowClass }
    })
  })
  // SimC Performance
  for (const simulationName of simulationNames) {
    for (const fightStyle of fightStyles) {
      for (const tier of tiers) {
        const { simulationFeaturedOrder, simulationCategory, simulationType } = simulations[simulationName]
        const slug = `/simc-performance/${simulationType}/${fightStyle}-${tier}`
        createPage({
          path: slug,
          component: resolve('./src/templates/simc-performance.js'),
          context: { slug, simulationFeaturedOrder, simulationCategory, simulationType, fightStyle, tier }
        })
      }
    }
  }

  // Simulations
  const result = await graphql(`
    {
      allFile(filter: {sourceInstanceName: {eq: "reports"}}) {
        edges {
          node {
            fields {
              slug
              name
              wowClass
              simulationFeaturedOrder
              simulationCategory
              simulationType
              simulationTemplate
              fightStyle
              tier
              spec
              variation
              fightLength
              fightLengthVariation
              targetError
              templateGear
              templateTalents
              templateDPS
              elapsedTime
              totalEventsProcessed
              totalIterations
              totalActors
              simcBuildTimestamp
              simcGitRevision
              wowVersion
              wowBuild
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
        component: resolve(`./src/templates/simulation/${fields.simulationTemplate}.js`),
        context: fields
      })
    })
  }
}
