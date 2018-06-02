/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators

  if (node.sourceInstanceName === 'reports' && node.internal.type === 'File') {
    // 'Rogue_Trinkets_1T_T21_Subtlety' -> ['rogue', 'trinkets', '1t, 't21', 'subtlety']
    const nameParts = node.name.toLowerCase().split('_')

    createFilePath({
      node,
      getNode,
      basePath: 'data/reports/'
    })

    createNodeField({
      node,
      name: 'simulationType',
      value: `${nameParts[1]}` // 'trinkets'
    })

    createNodeField({
      node,
      name: 'slug',
      value: `/${nameParts[0]}/${nameParts[1]}/${nameParts.slice(2).join('-')}` // '/rogue/trinkets/1t-t21-subtlety'
    })
  }
}

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
    const simulationType = node.fields.simulationType
    const slug = node.fields.slug
    createPage({
      path: slug,
      component: path.resolve(`./src/templates/simulations/${simulationType}.js`),
      context: {
        // Data passed to context is available in page queries as GraphQL variables.
        simulationType: simulationType,
        slug: slug
      }
    })
  })
}
