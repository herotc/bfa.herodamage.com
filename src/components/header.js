import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { langs } from '../../plugins/gatsby-plugin-herodamage-i18n'
import logo from '../assets/images/logo.svg'

const styles = (theme) => ({
  header: {
    paddingBottom: 1.45
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 auto',
    maxWidth: theme.breakpoints.values.lg,
    padding: [1.5, 1]
  },
  title: {
    margin: 0
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

const Header = ({classes, lang, onLangClick, siteTitle}) => (
  <header className={classes.header}>
    <div className={classes.container}>
      <Typography variant={'headline'} className={classes.title}>
        <Link to={`/${lang}/`} className={classes.link}>
          <img src={logo} style={{height: '3rem', width: '3rem'}}/>
          {siteTitle.split(' ').map((titlePart, index) => (<span key={index}>{titlePart}&nbsp;</span>))}
        </Link>
      </Typography>
      <Typography>
        {langs.map((langKey) =>
          <LangSelector key={langKey} className={classes.langSelector} lang={langKey}
            onClick={(e) => onLangClick(`${langKey}`)} selected={lang === `${langKey}`}/>
        )}
      </Typography>
    </div>
  </header>
)

Header.propTypes = {
  classes: PropTypes.object,
  lang: PropTypes.string,
  onLangClick: PropTypes.func,
  siteTitle: PropTypes.string
}

export default withStyles(styles)(Header)
