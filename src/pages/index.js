import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import startCase from 'lodash/startCase'
import { Trans } from '@lingui/react'
import { withStyles } from '@material-ui/core/styles/index'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import logo from '../assets/images/logo.svg'
import wowClassDeathKnight from '../assets/images/wow/classpicker/death_knight.svg'
import wowClassDemonHunter from '../assets/images/wow/classpicker/demon_hunter.svg'
import wowClassDruid from '../assets/images/wow/classpicker/druid.svg'
import wowClassHunter from '../assets/images/wow/classpicker/hunter.svg'
import wowClassMage from '../assets/images/wow/classpicker/mage.svg'
import wowClassMonk from '../assets/images/wow/classpicker/monk.svg'
import wowClassPaladin from '../assets/images/wow/classpicker/paladin.svg'
import wowClassPriest from '../assets/images/wow/classpicker/priest.svg'
import wowClassRogue from '../assets/images/wow/classpicker/rogue.svg'
import wowClassShaman from '../assets/images/wow/classpicker/shaman.svg'
import wowClassWarlock from '../assets/images/wow/classpicker/warlock.svg'
import wowClassWarrior from '../assets/images/wow/classpicker/warrior.svg'

const wowClassesToIcon = {
  'death-knight': wowClassDeathKnight,
  'demon-hunter': wowClassDemonHunter,
  'druid': wowClassDruid,
  'hunter': wowClassHunter,
  'mage': wowClassMage,
  'monk': wowClassMonk,
  'paladin': wowClassPaladin,
  'priest': wowClassPriest,
  'rogue': wowClassRogue,
  'shaman': wowClassShaman,
  'warlock': wowClassWarlock,
  'warrior': wowClassWarrior
}

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

const LangIndexPage = ({classes, data, i18nPlugin}) => {
  const siteMetadata = data.site.siteMetadata
  const {tLink} = i18nPlugin
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
                <img src={wowClassesToIcon[wowClass]} alt={startCase(wowClass)}/>
              </Grid>
            )
          })
        }
      </Grid>
      <List>
        <ListItem component={Link} to={tLink('/faq/')}><Trans>Go to faq</Trans></ListItem>
        <ListItem component={Link} to={tLink('/blog/')}><Trans>Go to blog</Trans></ListItem>
        <ListItem component={Link} to={tLink('/404/')}><Trans>Go to 404</Trans></ListItem>
        <ListItem component={Link} to={'/dev-404-page/'}><Trans>Go to dev error</Trans></ListItem>
      </List>
    </div>
  )
}

LangIndexPage.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  i18nPlugin: PropTypes.object
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
