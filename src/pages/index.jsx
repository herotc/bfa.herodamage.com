import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans, withI18n } from '@lingui/react'

const IndexPage = ({lang}) => (
  <div>
    <h1><Trans>Hi people</Trans></h1>
    <p><Trans>Welcome to your new Gatsby site.</Trans></p>
    <p><Trans>Now go build something great.</Trans></p>
    <ul>
      <li><Link to={`/${lang}/faq/`}><Trans>Go to faq</Trans></Link></li>
      <li><Link to={`/${lang}/blog/`}><Trans>Go to blog</Trans></Link></li>
      <li><Link to={`/${lang}/rogue/`}><Trans>Go to rogue</Trans></Link></li>
      <li><Link to={`/${lang}/404/`}><Trans>Go to 404</Trans></Link></li>
      <li><Link to={`/${lang}/error/`}><Trans>Go to dev error</Trans></Link></li>
    </ul>
  </div>
)

IndexPage.propTypes = {
  lang: PropTypes.string
}

export default withI18n()(IndexPage)
