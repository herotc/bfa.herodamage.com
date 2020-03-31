// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import Helmet from 'react-helmet'
import Button from '@material-ui/core/Button'

const GamePage = ({ data }) => (
  <div style={{textAlign: 'center'}}>
    <Helmet title={`Hero Damage: The Game | ${data.site.siteMetadata.title}`}/>
    <h1>Hero Damage: The Game</h1>
    <section>
      <p>Do you think Hero Damage is not interactive enough for you?</p>
      <p>Only boring tables and charts but you want something fun?</p>
      <p>You want things to happen? You want to be entertained?</p>
      <p>Then wait no more, for now we offer the perfect companion solution for our site.</p>
      <Button variant="contained" size="large" href="https://mystler.eu/dl/HeroDamageGame_Setup.exe" disableElevation>
        Download<br/>Hero Damage: The Game
      </Button>
      <p><i>(Hero Damage: The Game is currently only availbale for Windows. Sorry!)</i></p>
    </section>
  </div>
)

GamePage.propTypes = {
  data: PropTypes.object
}

export default GamePage

export const query = graphql`
  query GamePage {
    site {
      siteMetadata {
        title
      }
    }
  }
`
