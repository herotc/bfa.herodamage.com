import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'

const BlogPostTemplate = ({data, pathContext}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const {previous, next} = pathContext

  return (
    <div>
      <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}/>
      <h1>{post.frontmatter.title}</h1>
      <p>{post.frontmatter.date}</p>
      <div dangerouslySetInnerHTML={{__html: post.html}}/>
      <hr/>
      <ul>
        {previous && (<li><Link to={previous.fields.slug} rel="prev">← {previous.frontmatter.title}</Link></li>)}
        {next && (<li><Link to={next.fields.slug} rel="next">{next.frontmatter.title} →</Link></li>)}
      </ul>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object,
  pathContext: PropTypes.object
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPost($slug: String!) {
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
