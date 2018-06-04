import React from 'react'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'

const IndexPage = ({i18n}) => (
  <div>
    <h1><Trans>Hi people</Trans></h1>
    <p><Trans>Welcome to your new Gatsby site.</Trans></p>
    <p><Trans>Now go build something great.</Trans></p>
    <ul>
      <li><Link to="/en/faq/"><Trans>Go to faq</Trans></Link></li>
      <li><Link to="/en/blog/"><Trans>Go to blog</Trans></Link></li>
      <li><Link to="/en/rogue/"><Trans>Go to rogue</Trans></Link></li>
      <li><Link to="/en/404/"><Trans>Go to 404</Trans></Link></li>
      <li><Link to="/en/error/"><Trans>Go to dev error</Trans></Link></li>
    </ul>
  </div>
)

export default withI18n()(IndexPage)
