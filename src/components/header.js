import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { langs } from '../../plugins/gatsby-plugin-herodamage-i18n'
import logo from '../assets/images/logo.svg'

const styles = (theme) => ({
  header: {
    alignItems: 'center',
    background: theme.custom.color.background.layout,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  link: {
    alignItems: 'center',
    color: theme.palette.common.white,
    display: 'flex',
    fontWeight: 500,
    textDecoration: 'none',
    '& span': {
      '&:nth-of-type(1)': {
        color: theme.palette.common.white
      },
      '&:nth-of-type(2)': {
        color: theme.palette.secondary.main
      }
    }
  },
  logo: {
    height: '3rem',
    width: '3rem'
  },
  langSelector: {
    color: theme.palette.common.white,
    cursor: 'pointer',
    fontSize: 20,
    marginRight: 10
  }
})

const LangSelector = ({classes, i18nPlugin, lang, selected}) => (
  <a className={classes.langSelector} onClick={() => i18nPlugin.changeLang(lang)}
    style={{textDecoration: selected ? 'underline' : 'none'}}>{lang}</a>
)
LangSelector.propTypes = {
  classes: PropTypes.object,
  i18nPlugin: PropTypes.object,
  lang: PropTypes.string,
  selected: PropTypes.bool
}

const Header = ({classes, i18nPlugin, siteMetadata}) => (
  <header>
    <Paper className={classes.header} elevation={1}>
      <Typography variant={'headline'}>
        <Link to={`/${i18nPlugin.lang}/`} className={classes.link}>
          <img src={logo} className={classes.logo}/>
          {siteMetadata.title
            .split(' ')
            .map((titlePart, index) => (<span key={index}>{titlePart}&nbsp;</span>))}
        </Link>
      </Typography>
      {
        i18nPlugin.isIntlPage &&
        <Typography>
          {
            langs.map((lang, index) => (
              <LangSelector key={index} classes={classes} i18nPlugin={i18nPlugin} lang={lang}
                selected={i18nPlugin.lang === lang}/>
            ))
          }
        </Typography>
      }

    </Paper>
  </header>
)

Header.propTypes = {
  classes: PropTypes.object,
  i18nPlugin: PropTypes.object,
  siteMetadata: PropTypes.object
}

export default withStyles(styles)(Header)
