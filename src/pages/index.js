import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { translation } from '../../plugins/gatsby-plugin-herodamage-i18n'
import langRedirect from '../browser/langRedirect'

class IndexPage extends React.Component {
  componentDidMount () {
    try {
      langRedirect()
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {langs} = this.props.i18nPlugin
    return (
      <List>
        {
          langs.map((lang, index) => {
            const t = translation(lang)
            return (
              <ListItem key={index} component={Link} to={`/${lang}/`}>[{lang.toUpperCase()}] {t('Welcome to Hero Damage')}</ListItem>
            )
          })
        }
      </List>
    )
  }
}

IndexPage.propTypes = {
  i18nPlugin: PropTypes.object
}

export default IndexPage
