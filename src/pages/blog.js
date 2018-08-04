import React from 'react'
import PropTypes from 'prop-types'

const BlogPage = ({data}) => {
  console.log(data)
  return (
    <div>
      <h1>
        Blog
      </h1>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({node}) => (
        <div key={node.id}>
          <h3>
            {node.frontmatter.title}{' '}
            <span>— {node.frontmatter.date}</span>
          </h3>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  )
}

BlogPage.propTypes = {
  data: PropTypes.object
}

export default BlogPage

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date
          }
          excerpt
        }
      }
    }
  }
`
