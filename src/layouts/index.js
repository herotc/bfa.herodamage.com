import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/header'
import './index.css'

const Content = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1.0875rem 1.45rem;
`

const Layout = ({children, data}) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        {name: 'description', content: 'Sample'},
        {name: 'keywords', content: 'sample, something'}
      ]}
    />
    <Header siteTitle={data.site.siteMetadata.title}/>
    <Content>{children()}</Content>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
