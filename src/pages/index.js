import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

const IndexPage = ({i18nPlugin}) => {
  const {langs} = i18nPlugin
  return (
    <div>
      {
        langs.map((lang, index) => (
          <Link key={index} to={`/${lang}/`}>{lang}</Link>
        ))
      }
    </div>
  )
}

IndexPage.propTypes = {
  i18nPlugin: PropTypes.object
}

export default IndexPage
