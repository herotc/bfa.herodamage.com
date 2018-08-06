import React from 'react'
import PropTypes from 'prop-types'
import { I18nProvider } from '@lingui/react'
import { navigateTo } from 'gatsby-link'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Head from '../components/head'
import Header from '../components/header'
import Main from '../components/main'
import Footer from '../components/footer'
import * as i18nPluginHelper from '../../plugins/gatsby-plugin-herodamage-i18n'
import withRoot from '../../plugins/gatsby-plugin-herodamage-material-ui/withRoot'

const styles = (theme) => ({
  layout: {
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
    },
    '& .site-name': {
      '& span': {
        fontWeight: 500,
        '&:nth-of-type(1)': {
          color: theme.palette.common.white
        },
        '&:nth-of-type(2)': {
          color: theme.palette.secondary.main
        }
      }
    },
    '& #results-loader': {
      display: 'block',
      marginTop: theme.spacing.unit * 8,
      marginBottom: theme.spacing.unit * 8,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    '& #chart-overlay': {
      width: '2px',
      position: 'absolute',
      backgroundColor: '#FFF',
      pointerEvents: 'none',
      zIndex: 2,
    },
    '& .chart-tooltip': {
      color: '#000',
      fontSize: 18,
      padding: 8,
      whiteSpace: 'nowrap',
    }
  }
})

const Layout = ({classes, ...props}) => {
  const {data, i18nPlugin} = props
  const siteMetadata = data.site.siteMetadata
  return (
    <Typography className={classes.layout} component={'div'}>
      <Head siteMetadata={siteMetadata}/>
      <Header i18nPlugin={i18nPlugin} siteMetadata={siteMetadata}/>
      <Main {...props}/>
      <Footer siteMetadata={siteMetadata}/>
    </Typography>
  )
}

Layout.propTypes = {
  children: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.object,
  i18nPlugin: PropTypes.object
}

const IndexLayout = (props) => {
  const {pathname} = props.location
  const lang = i18nPluginHelper.langFromPath(pathname)
  const i18nPlugin = {
    changeLang: (newLang) => {
      navigateTo(i18nPluginHelper.replacePrefix(newLang, pathname))
    },
    lang,
    langs: i18nPluginHelper.langs,
    isIntlPage: i18nPluginHelper.isIntlPage(pathname),
    t: i18nPluginHelper.translation(lang),
    tLink: (path) => i18nPluginHelper.replacePrefix(lang, path)
  }
  return (
    <I18nProvider language={lang} catalogs={i18nPluginHelper.catalogs}>
      <Layout {...props} i18nPlugin={i18nPlugin}/>
    </I18nProvider>
  )
}

IndexLayout.propTypes = {
  location: PropTypes.object
}

export default withRoot(withStyles(styles)(IndexLayout))

export const query = graphql`
  query IndexLayout {
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
