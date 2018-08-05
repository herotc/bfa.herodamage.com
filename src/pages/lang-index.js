import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import logo from '../assets/images/logo.svg'
import { withStyles } from '@material-ui/core/styles/index'

const styles = (theme) => ({
  section: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    '& figure': {
      margin: 0,
      '& img': {
        height: '10rem',
        width: '10rem'
      }
    }
  }
})

const LangIndexPage = ({classes, data, i18nPlugin}) => {
  const siteMetadata = data.site.siteMetadata
  const {tLink} = i18nPlugin
  return (
    <div>
      <section className={classes.section}>
        <figure>
          <img src={logo} alt={`${data.site.siteMetadata.title} Logo`}/>
        </figure>
        <div>
          <h1 className="site-name">
            {siteMetadata.title.split(' ').map((titlePart, index) => (<span key={index}>{index > 0 && ' '}{titlePart}</span>))}
          </h1>
          <p><Trans>Welcome to Hero Damage, the website where you can see the latest World of Warcraft simulations
            results for every class.<br/>
            Please select your class below.
          </Trans></p>
        </div>
      </section>
      <List>
        <ListItem component={Link} to={tLink('/faq/')}><Trans>Go to faq</Trans></ListItem>
        <ListItem component={Link} to={tLink('/blog/')}><Trans>Go to blog</Trans></ListItem>
        <ListItem component={Link} to={tLink('/rogue/')}><Trans>Go to rogue</Trans></ListItem>
        <ListItem component={Link} to={'/404/'}><Trans>Go to 404</Trans></ListItem>
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

export default withI18n()(withStyles(styles)(LangIndexPage))

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
