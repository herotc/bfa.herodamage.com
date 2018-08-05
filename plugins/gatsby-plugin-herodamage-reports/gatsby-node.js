const fs = require('fs').promises
const path = require('path')

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

module.exports.onCreateNode = async function ({node, getNode, boundActionCreators}) {
  const {createNodeField, deleteNode} = boundActionCreators

  // Prevents non reports files to be processed
  if (node.sourceInstanceName !== 'reports') return
  // Prevents directories to be processed
  if (node.internal.type !== 'File') return
  // Delete unwanted node from reports (things like .DS_Store)
  if (node.extension !== 'json') {
    deleteNode(node.id, node)
    return
  }

  // Example file: 'reports/TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation.json'

  // 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
  const name = node.name
  // ['trinketsimulation', '1t', 't21', 'death-knight', 'frost', 'cold-heart-runic-attenuation']
  const [simulationName, fightStyle, tier, wowClass, spec, variation] = name.toLowerCase().split('_')
  // 'trinkets', 4
  const {simulationType, order, template} = simulations[simulationName]
  // '/death-knight/trinkets/1t-t21-frost
  let slug = `/${wowClass}/${simulationType}/${fightStyle}-${tier}-${spec}`
  if (variation) slug += `-${variation}`

  // slug: '/death-knight/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
  createNodeField({node, name: 'slug', value: slug})
  // name: 'TrinketSimulation_1T_T21_Death-Knight_Frost_Cold-Heart-Runic-Attenuation'
  createNodeField({node, name: 'name', value: name})
  // wowClass: 'death-knight'
  createNodeField({node, name: 'wowClass', value: wowClass})
  // simulationType: 'trinkets'
  createNodeField({node, name: 'simulationType', value: simulationType})
  // order: 4
  createNodeField({node, name: 'order', value: order})
  // template: 'Trinkets'
  createNodeField({node, name: 'template', value: template})
  // fightStyle: '1t'
  createNodeField({node, name: 'fightStyle', value: fightStyle})
  // tier: 't21'
  createNodeField({node, name: 'tier', value: tier})
  // spec: 'frost'
  createNodeField({node, name: 'spec', value: spec})
  // variation: 'cold-heart-runic-attenuation' (optional, if it doesn't exist then it's an empty string '')
  createNodeField({node, name: 'variation', value: variation || ''})

  // Register the wow class to create the corresponding index page if it's the first time we meet it
  if (!wowClasses[wowClass]) wowClasses[wowClass] = true

  // Get the metas from the file
  let json
  try {
    const jsonFile = await fs.readFile(node.absolutePath, {encoding: 'utf8', flag: 'r'})
    json = JSON.parse(jsonFile).metas
  } catch (err) {
    console.error(`Error while processing the '${name}' report:`, err)
    return
  }
  const optionsDbc = json['options']['dbc']
  const versionUsed = optionsDbc[optionsDbc['version_used']]
  createNodeField({node, name: 'targetError', value: json['options']['target_error']})
  createNodeField({node, name: 'resultTime', value: json['result_timestamp']})
  createNodeField({node, name: 'version', value: versionUsed['wow_version']})
  createNodeField({node, name: 'build', value: versionUsed['build_level']})
  createNodeField({node, name: 'buildTime', value: json['build_timestamp']})
  createNodeField({node, name: 'gitRevision', value: json['git_revision'] || ''})
}

module.exports.createPages = async function ({graphql, boundActionCreators}) {
  const {createPage} = boundActionCreators

  // Make the class index pages by iterating over discovered classes during onCreateNode
  Object.keys(wowClasses).forEach((wowClass) => {
    const slug = `/${wowClass}/`
    createPage({
      path: slug,
      component: path.resolve('./src/templates/wow-class.js'),
      context: {slug, wowClass}
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
              fightStyle
              tier
              spec
              variation
              targetError
              resultTime
              version
              build
              buildTime
              gitRevision
            }
          }
        }
      }
    }
  `)
  const {allFile} = result.data
  if (allFile) {
    allFile.edges.forEach(({node}) => {
      const fields = node.fields
      createPage({
        path: fields.slug,
        component: path.resolve(`./src/templates/simulation/${fields.template}.js`),
        context: fields
      })
    })
  }
}
