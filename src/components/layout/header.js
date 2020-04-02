import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Link } from 'gatsby'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { langs } from '../../../plugins/gatsby-plugin-herodamage-i18n'

import logo from '../../assets/images/logo.svg'

const styles = (theme) => ({
  header: {
    alignItems: 'center',
    background: theme.custom.color.background.layout,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  logo: {
    margin: 0,
    '& a': {
      alignItems: 'center',
      display: 'flex',
      '& img': {
        height: '3rem',
        width: '3rem'
      }
    }
  },
  langSelector: {
    color: theme.palette.common.white,
    cursor: 'pointer',
    fontSize: 20,
    marginRight: 10
  }
})

const LangSelector = ({ classes, i18nPlugin, lang, selected }) => (
  <a className={classes.langSelector} onClick={() => i18nPlugin.changeLang(lang)}
    style={{ textDecoration: selected ? 'underline' : 'none' }}>{lang}</a>
)
LangSelector.propTypes = {
  classes: PropTypes.object,
  i18nPlugin: PropTypes.object,
  lang: PropTypes.string,
  selected: PropTypes.bool
}

const Header = ({ classes, i18nPlugin, siteMetadata }) => (
  <header>
    <Paper className={classes.header} elevation={1}>
      <h2 className={classes.logo}>
        <Link to={i18nPlugin.tLink('/')}>
          <img src={logo} alt={`${siteMetadata.title} Logo`}/>
          <span className={'site-name'}>
            {siteMetadata.title.split(' ').map((titlePart, index) => (
              <span key={index}>{index > 0 && ' '}{titlePart}</span>
            ))}
          </span>
        </Link>
      </h2>
      <Typography>
        {langs.map((lang, index) => (
          <LangSelector key={index} classes={classes} i18nPlugin={i18nPlugin} lang={lang}
            selected={i18nPlugin.lang === lang}/>
        ))}
      </Typography>
    </Paper>
  </header>
)

Header.propTypes = {
  classes: PropTypes.object,
  i18nPlugin: PropTypes.object,
  siteMetadata: PropTypes.object
}

export default withStyles(styles)(Header)
