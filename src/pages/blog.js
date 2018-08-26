// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import Layout from '../components/layout'

const BlogPage = ({data, location}) => (
  <Layout location={location}>
    <div>
      <h1>Blog</h1>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({node}) => (
        <div key={node.id}>
          <h3>{node.frontmatter.title}{' '}<span>— {node.frontmatter.date}</span></h3>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </div>
  </Layout>
)

BlogPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default BlogPage

export const query = graphql`
  query BlogPageIndex {
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
