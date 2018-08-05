import React from 'react'
import PropTypes from 'prop-types'
import { I18nProvider } from '@lingui/react'
import { navigateTo } from 'gatsby-link'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import Head from '../components/head'
import Header from '../components/header'
import Main from '../components/main'
import Footer from '../components/footer'
import { catalogs, replacePrefix, langFromPath, translation } from '../../plugins/gatsby-plugin-herodamage-i18n'
import withRoot from '../../plugins/gatsby-plugin-herodamage-material-ui/withRoot'

const styles = (theme) => ({
  layout: Object.assign({}, theme.typography.body1, {
    margin: '0 auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.up('xl')]: {
      maxWidth: 2 / 3 * 100 + '%'
    },
    '& h1': theme.typography.headline,
    '& h2': theme.typography.title,
    '& h3': theme.typography.subheading,
    '& h4': theme.typography.body2,
    '& figcaption': theme.typography.caption,
    '& a': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.secondary.light
      }
    }
  })
})

// We do extract the classes object since we do not want to pass it to children
const Layout = ({classes, ...props}) => {
  const {data, lang, onLangChange} = props
  const siteMetadata = data.site.siteMetadata
  return (
    <div className={classes.layout}>
      <Head siteMetadata={siteMetadata}/>
      <Header lang={lang} onLangClick={onLangChange} siteMetadata={siteMetadata}/>
      <Main {...props}/>
      <Footer siteMetadata={siteMetadata}/>
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
  query HeadQuery {
    site {
      siteMetadata {
        title
        github
        description
        keywords
      }
    }
  }
`
