const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.onCreateNode = async ({node, getNode, boundActionCreators}) => {
  const {createNodeField} = boundActionCreators

  // Prevents non markdown files & non posts files to be processed
  // Done in two times so we don't have to check if fileAbsolutePath exists since it's a MardownRemark property only
  if (node.internal.type !== 'MarkdownRemark') return
  if (node.fileAbsolutePath.indexOf(path.resolve('./src/posts/')) === -1) return

  createFilePath({node, getNode, basePath: 'posts/'})

  // We currently have the MardownRemark node which is a child of the file node that contains markdown information
  // So we request the parent node, which is the node from filesystem, to build the slug
  const parentNode = getNode(node.parent)
  // Example file: 'posts/2018-06-03-test-post.md'
  const name = parentNode.name // '2018-06-03-test-post'
  const nameParts = name.toLowerCase().split('-') // ['2018', '06', '03', 'test', 'post']
  const [year, month, day] = nameParts
  // slug: '/2018/06/03/test-post'
  createNodeField({
    node,
    name: 'slug',
    value: `/${year}/${month}/${day}/${nameParts.slice(3).join('-')}`
  })
}

exports.createPages = async ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({node}) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/templates/blog-post.js'),
      context: {
        slug: node.fields.slug
      }
    })
  })
}
