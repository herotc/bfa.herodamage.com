import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { I18nProvider } from '@lingui/react'
import { navigateTo } from 'gatsby-link'
import Header from '../components/header'
import { catalogs, replacePrefix, langFromPath } from '../../plugins/gatsby-plugin-herodamage-i18n'
import styled from 'styled-components'
import './index.css'

const Main = styled.main`
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1.0875rem 1.45rem;
`

const Layout = ({onLangChange, ...props}) => {
  const {children, data, lang} = props
  return (
    <div>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          {name: 'description', content: 'Sample'},
          {name: 'keywords', content: 'sample, something'}
        ]}
      />
      <Header lang={lang} onLangClick={onLangChange} siteTitle={data.site.siteMetadata.title}/>
      <Main>{children(props)}</Main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object,
  lang: PropTypes.string,
  onLangChange: PropTypes.func
}

class IndexLayout extends React.Component {
  onLangChange = (lang) => {
    navigateTo(replacePrefix(lang, this.props.location.pathname))
  }

  render = () => {
    const lang = langFromPath(this.props.location.pathname)
    return (
      <I18nProvider language={lang} catalogs={catalogs}>
        <Layout {...this.props} lang={lang} onLangChange={this.onLangChange} />
      </I18nProvider>
    )
  }
}

IndexLayout.propTypes = {
  location: PropTypes.object
}

export default IndexLayout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
