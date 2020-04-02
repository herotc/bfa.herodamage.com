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
      <p><i>This was the gimmick for April 1st, 2020 on Hero Damage. Yes, it's an actual game. The navigation link here has been removed again, but the direct link still works and you can still download and play the game if you wish.</i></p>
      <p>Do you think Hero Damage is not interactive enough for you?</p>
      <p>Only boring tables and charts but you want something fun?</p>
      <p>You want things to happen? You want to be entertained?</p>
      <p>Then wait no more, for now we offer the perfect companion solution for our site.</p>
      <Button variant="contained" size="large" href="https://mystler.eu/dl/HeroDamageGame_Setup.exe" disableElevation>
        Download<br/>Hero Damage: The Game<br/>(Installer)
      </Button>
      <p><i>Hero Damage: The Game is only available for Windows and in English.</i></p>
      <p><a href="https://mystler.eu/dl/HeroDamageGame.zip">Download Hero Damage: The Game (ZIP)</a><br/>in case you don't want (or your browser doesn't trust) the installer.</p>
      <p><i>Because of the way the Hero Damage website is generated from simulation data, these game files are instead hosted on Mystler's server. If you have issues with your browser or windows defender blocking the installer, you can get the ZIP file instead and unpack it to a location of your choice.</i></p>
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
