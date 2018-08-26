// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import Helmet from 'react-helmet'
import { Link } from 'gatsby'
import Layout from '../components/layout'

const BlogPostTemplate = ({data, location, pathContext}) => {
  const post = data.markdownRemark
  const {previous, next} = pathContext
  return (
    <Layout location={location}>
      <div>
        <Helmet title={`${post.frontmatter.title} | ${data.site.siteMetadata.title}`}/>
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
        <div dangerouslySetInnerHTML={{__html: post.html}}/>
        <hr/>
        <ul>
          {previous && (<li><Link to={previous.fields.slug} rel="prev">← {previous.frontmatter.title}</Link></li>)}
          {next && (<li><Link to={next.fields.slug} rel="next">{next.frontmatter.title} →</Link></li>)}
        </ul>
      </div>
    </Layout>
  )
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired
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
