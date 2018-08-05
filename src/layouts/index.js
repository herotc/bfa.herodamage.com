import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { I18nProvider } from '@lingui/react'
import { navigateTo } from 'gatsby-link'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import Header from '../components/header'
import { catalogs, replacePrefix, langFromPath, translation } from '../../plugins/gatsby-plugin-herodamage-i18n'
import withRoot from '../../plugins/gatsby-plugin-herodamage-material-ui/withRoot'

const styles = (theme) => ({
  main: {
    margin: '0 auto',
    maxWidth: theme.breakpoints.values.lg,
    padding: '0 1rem 1.5rem'
  }
})

const Layout = (props) => {
  const {children, classes, data, lang, onLangChange} = props
  return (
    <div>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <meta name="description" content="Sample"/>
        <meta name="keywords" content="sample, something"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
      </Helmet>
      <Header lang={lang} onLangClick={onLangChange} siteTitle={data.site.siteMetadata.title}/>
      <main className={classes.main}>{children(props)}</main>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.object,
  lang: PropTypes.string,
  onLangChange: PropTypes.func
}

const IndexLayout = (props) => {
  const {pathname} = props.location
  const onLangChange = (lang) => {
    navigateTo(replacePrefix(lang, pathname))
  }
  const lang = langFromPath(pathname)
  const t = translation(lang)
  return (
    <I18nProvider language={lang} catalogs={catalogs}>
      <CssBaseline/>
      <Layout {...props} lang={lang} onLangChange={onLangChange} t={t}/>
    </I18nProvider>
  )
}

IndexLayout.propTypes = {
  location: PropTypes.object
}

export default withRoot(withStyles(styles)(IndexLayout))

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
