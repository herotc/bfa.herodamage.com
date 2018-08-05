import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const IndexPage = ({lang}) => (
  <div>
    <h1><Trans>Hi people</Trans></h1>
    <p><Trans>Welcome to your new Gatsby site.</Trans></p>
    <p><Trans>Now go build something great.</Trans></p>
    <List>
      <ListItem component={Link} to={`/${lang}/faq/`}><Trans>Go to faq</Trans></ListItem>
      <ListItem component={Link} to={`/${lang}/blog/`}><Trans>Go to blog</Trans></ListItem>
      <ListItem component={Link} to={`/${lang}/rogue/`}><Trans>Go to rogue</Trans></ListItem>
      <ListItem component={Link} to={`/${lang}/404/`}><Trans>Go to 404</Trans></ListItem>
      <ListItem component={Link} to={`/${lang}/error/`}><Trans>Go to dev error</Trans></ListItem>
    </List>
  </div>
)

IndexPage.propTypes = {
  lang: PropTypes.string
}

export default withI18n()(IndexPage)
