// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
// Components
import Helmet from 'react-helmet'

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark
  const { previous, next } = pageContext
  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${data.site.siteMetadata.title}`}/>
      <h1>{post.frontmatter.title}</h1>
      <p>{post.frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      <hr/>
      <ul>
        {previous && (<li><Link to={previous.fields.slug} rel="prev">← {previous.frontmatter.title}</Link></li>)}
        {next && (<li><Link to={next.fields.slug} rel="next">{next.frontmatter.title} →</Link></li>)}
      </ul>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired
}

export default BlogPostTemplate

export const query = graphql`
  query BlogPostTemplate($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date
        categories
        author
      }
    }
  }
`
