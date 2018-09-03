// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import startCase from 'lodash/startCase'
import { withStyles } from '@material-ui/core/styles'
import { wowIcon } from '../utils/wow/ui'
// Components
import { Trans } from '@lingui/react'
import Grid from '@material-ui/core/Grid'
// Assets
import logo from '../assets/images/logo.svg'

const styles = (theme) => ({
  introduction: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    '& figure': {
      margin: 0,
      '& img': {
        height: '10rem',
        width: '10rem'
      }
    },
    marginBottom: theme.spacing.unit * 8
  },
  wowClasses: {
    margin: 'auto',
    maxWidth: '80%',
    textAlign: 'center',
    '& a': {
      '&:hover': {
        '& img': {
          transform: 'scale(1.2)'
        }
      },
      '& img': {
        transition: theme.custom.css.transitionNormal,
        maxWidth: '50%'
      }
    }
  }
})

const LangIndexPage = ({ classes, data, i18nPlugin }) => {
  const siteMetadata = data.site.siteMetadata
  const { tLink } = i18nPlugin
  return (
    <div>
      <section className={classes.introduction}>
        <figure>
          <img src={logo} alt={`${siteMetadata.title} Logo`}/>
        </figure>
        <div>
          <h1 className="site-name">
            {siteMetadata.title.split(' ').map((titlePart, index) => (
              <span key={index}>{index > 0 && ' '}{titlePart}</span>))}
          </h1>
          <p><Trans>Welcome to Hero Damage, the website where you can see the latest World of Warcraft simulations
            results for every class.<br/>
            Please select your class below.
          </Trans></p>
        </div>
      </section>
      <Grid container spacing={32} className={classes.wowClasses}>
        {
          siteMetadata.wowClasses.map((wowClass, index) => {
            return (
              <Grid item key={index} component={Link} to={tLink(`/${wowClass}/`)} xs={12} sm={6} md={4} lg={3}>
                <img src={wowIcon(wowClass)} alt={startCase(wowClass)}/>
              </Grid>
            )
          })
        }
      </Grid>
    </div>
  )
}

LangIndexPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object.isRequired
}

export default withStyles(styles)(LangIndexPage)

export const query = graphql`
  query LangIndexPage {
    site {
      siteMetadata {
        title
        wowClasses
      }
    }
  }
`
