import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'

const IndexPage = ({lang}) => (
  <div>
    <Typography variant={'title'}><Trans>Hi people</Trans></Typography>
    <Typography><Trans>Welcome to your new Gatsby site.</Trans></Typography>
    <Typography><Trans>Now go build something great.</Trans></Typography>
    <List>
      <ListItem button={true} component={Link} to={`/${lang}/faq/`}>
        <Typography><Trans>Go to faq</Trans></Typography>
      </ListItem>
      <ListItem component={Link} to={`/${lang}/blog/`}>
        <Typography><Trans>Go to blog</Trans></Typography>
      </ListItem>
      <ListItem component={Link} to={`/${lang}/rogue/`}>
        <Typography><Trans>Go to rogue</Trans></Typography>
      </ListItem>
      <ListItem component={Link} to={`/${lang}/404/`}>
        <Typography><Trans>Go to 404</Trans></Typography>
      </ListItem>
      <ListItem component={Link} to={`/${lang}/error/`}>
        <Typography><Trans>Go to dev error</Trans></Typography>
      </ListItem>
    </List>
  </div>
)

IndexPage.propTypes = {
  lang: PropTypes.string
}

export default withI18n()(IndexPage)
