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
    background: theme.palette.custom.layout,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2
  },
  link: {
    alignItems: 'center',
    color: theme.palette.common.white,
    display: 'flex',
    fontWeight: 'bold',
    textDecoration: 'none',
    '& span:nth-of-type(2)': {
      color: theme.palette.secondary.main
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
    marginRight: 10,
    textDecoration: props => props.selected ? 'underline' : 'none'
  }
})

const LangSelector = ({className, lang, onClick}) => (
  <a className={className} onClick={onClick}>{lang}</a>
)
LangSelector.propTypes = {
  className: PropTypes.string,
  lang: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool
}

const Header = ({classes, lang, onLangClick, siteMetadata}) => (
  <header>
    <Paper className={classes.header} elevation={1}>
      <Typography variant={'headline'}>
        <Link to={`/${lang}/`} className={classes.link}>
          <img src={logo} className={classes.logo}/>
          {siteMetadata.title
            .split(' ')
            .map((titlePart, index) => (<span key={index}>{titlePart}&nbsp;</span>))}
        </Link>
      </Typography>
      <Typography>
        {langs.map((langKey) =>
          <LangSelector key={langKey} className={classes.langSelector} lang={langKey}
            onClick={(e) => onLangClick(`${langKey}`)} selected={lang === `${langKey}`}/>
        )}
      </Typography>
    </Paper>
  </header>
)

Header.propTypes = {
  classes: PropTypes.object,
  lang: PropTypes.string,
  onLangClick: PropTypes.func,
  siteMetadata: PropTypes.object
}

export default withStyles(styles)(Header)
