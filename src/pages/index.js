import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const IndexPage = ({i18nPlugin}) => {
  const {tLink} = i18nPlugin
  return (
    <div>
      <h1><Trans>Hi people</Trans></h1>
      <p><Trans>Welcome to your new Gatsby site.</Trans></p>
      <p><Trans>Now go build something great.</Trans></p>
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

IndexPage.propTypes = {
  i18nPlugin: PropTypes.object
}

export default withI18n()(IndexPage)
