import { resolve } from 'path'

export const onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField, deleteNode } = actions

  // Prevents non markdown files to be processed
  if (node.internal.type !== 'MarkdownRemark') return

  // We currently have the MardownRemark node which is a child of the file node that only contains markdown information
  // So we request the parent node, which is the node from filesystem, to build the slug
  const parentNode = getNode(node.parent)

  // Prevents non posts files to be processed
  if (parentNode.sourceInstanceName !== 'posts') return
  // Prevents directories to be processed
  if (parentNode.internal.type !== 'File') return
  // Delete unwanted node from posts (things like .DS_Store)
  if (parentNode.extension !== 'md') {
    deleteNode({ node: parentNode })
    return
  }

  // TODO: Support pages made with 'name.lang.ext' like 'fancy-post.fr.md'
  // Example file: 'posts/2018-06-03-test-post.md'
  const name = parentNode.name // '2018-06-03-test-post'
  const nameParts = name.toLowerCase().split('-') // ['2018', '06', '03', 'test', 'post']
  const [year, month, day] = nameParts
  // slug: '/2018/06/03/test-post'
  createNodeField({ node, name: 'slug', value: `/${year}/${month}/${day}/${nameParts.slice(3).join('-')}` })
}

export const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

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
  const { allMarkdownRemark } = result.data
  if (allMarkdownRemark) {
    allMarkdownRemark.edges.forEach(({ node }) => {
      const slug = node.fields.slug
      createPage({
        path: slug,
        component: resolve('./src/templates/blog-post.js'),
        context: { slug }
      })
    })
  }
}
