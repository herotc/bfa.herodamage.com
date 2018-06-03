/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const fs = require('fs').promises
const path = require('path')
const {createFilePath} = require('gatsby-source-filesystem')

// Simulation report nodes creation
exports.onCreateNode = async ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators

  if (node.sourceInstanceName !== 'reports' || node.internal.type !== 'File') return

  createFilePath({node, getNode, basePath: 'data/reports/'})

  const name = node.name // 'Death-Knight_Trinkets_1T_T21_Frost_Cold-Heart-Runic-Attenuation'
  const nameParts = name.toLowerCase().split('_') // ['death-knight', 'trinkets', '1t', 't21', 'frost', 'cold-heart-runic-attenuation']
  // slug: '/death-knight/trinkets/1t-t21-frost-cold-heart-runic-attenuation'
  createNodeField({node, name: 'slug', value: `/${nameParts[0]}/${nameParts[1]}/${nameParts.slice(2).join('-')}`})
  // name: 'Death-Knight_Trinkets_1T_T21_Frost_Cold-Heart-Runic-Attenuation'
  createNodeField({node, name: 'name', value: name})
  // class: 'death-knight'
  createNodeField({node, name: 'class', value: `${nameParts[0]}`})
  // simulationType: 'trinkets'
  createNodeField({node, name: 'simulationType', value: `${nameParts[1]}`})
  // fightstyle: '1t'
  createNodeField({node, name: 'fightStyle', value: `${nameParts[2]}`})
  // tier: 't21'
  createNodeField({node, name: 'tier', value: `${nameParts[3]}`})
  // spec: 'frost'
  createNodeField({node, name: 'spec', value: `${nameParts[4]}`})
  // variation: 'cold-heart-runic-attenuation' (optionnal, if it doesn't exist then it's an empty string '')
  createNodeField({node, name: 'variation', value: `${nameParts[5] || ''}`})

  // Get the metas from the file
  const json = JSON.parse(await fs.readFile(node.absolutePath, {encoding: 'utf8', flag: 'r'})).metas
  const versionUsed = json['options']['dbc']['version_used']
  createNodeField({node, name: 'version', value: json['options']['dbc'][versionUsed]['wow_version']})
  createNodeField({node, name: 'build', value: json['options']['dbc'][versionUsed]['build_level']})
  createNodeField({node, name: 'targetError', value: json['options']['target_error']})
  createNodeField({node, name: 'buildTime', value: json['build_timestamp']})
  createNodeField({node, name: 'resultTime', value: json['result_timestamp']})
}

// Simulation report pages creation
exports.createPages = async ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators
  const result = await graphql(`
    {
      allFile {
        edges {
          node {
            fields {
              simulationType
              slug
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
