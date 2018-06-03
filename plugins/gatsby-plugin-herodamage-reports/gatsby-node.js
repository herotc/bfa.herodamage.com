const fs = require('fs').promises
const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')

// Simulation report nodes creation
exports.onCreateNode = async ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators

  if (node.sourceInstanceName !== 'reports' || node.internal.type !== 'File') return

  createFilePath({node, getNode, basePath: 'reports/'})

  // Example file: 'reports/25901/Death-Knight_Trinkets_1T_T21_Frost_Cold-Heart-Runic-Attenuation.json'
  const name = node.name // 'Death-Knight_Trinkets_1T_T21_Frost_Cold-Heart-Runic-Attenuation'
  const nameParts = name.toLowerCase().split('_') // ['death-knight', 'trinkets', '1t', 't21', 'frost', 'cold-heart-runic-attenuation']
  const [wowClass, simulationType, fightStyle, tier, spec, variation] = nameParts
  // slug: '/death-knight/25901/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
  createNodeField({
    node,
    name: 'slug',
    value: `/${wowClass}/${node.relativeDirectory}/${simulationType}/${nameParts.slice(2).join('-')}`
  })
  // name: 'Death-Knight_Trinkets_1T_T21_Frost_Cold-Heart-Runic-Attenuation'
  createNodeField({node, name: 'name', value: name})
  // wowClass: 'death-knight'
  createNodeField({node, name: 'wowClass', value: wowClass})
  // simulationType: 'trinkets'
  createNodeField({node, name: 'simulationType', value: simulationType})
  // fightStyle: '1t'
  createNodeField({node, name: 'fightStyle', value: fightStyle})
  // tier: 't21'
  createNodeField({node, name: 'tier', value: tier})
  // spec: 'frost'
  createNodeField({node, name: 'spec', value: spec})
  // variation: 'cold-heart-runic-attenuation' (optional, if it doesn't exist then it's an empty string '')
  createNodeField({node, name: 'variation', value: variation || ''})

  // Get the metas from the file
  const json = JSON.parse(await fs.readFile(node.absolutePath, {encoding: 'utf8', flag: 'r'})).metas
  const versionUsed = json['options']['dbc'][json['options']['dbc']['version_used']]
  createNodeField({node, name: 'version', value: versionUsed['wow_version']})
  createNodeField({node, name: 'build', value: versionUsed['build_level']})
  createNodeField({node, name: 'targetError', value: json['options']['target_error']})
  createNodeField({node, name: 'buildTime', value: json['build_timestamp']})
  createNodeField({node, name: 'resultTime', value: json['result_timestamp']})
}

// Simulation report pages creation
exports.createPages = async ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators
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
              fightStyle
              tier
              spec
              variation
              version
              build
              targetError
              buildTime
              resultTime
            }
          }
        }
      }
    }
  `)
  result.data.allFile.edges.forEach(({node}) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/simulations/${node.fields.simulationType}.js`),
      context: node.fields
    })
  })
}
