import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import startCase from 'lodash/startCase'
import { Trans, withI18n } from '@lingui/react'
import { withStyles } from '@material-ui/core/styles/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import { racesInit } from '../../browser/charts/races'

const styles = (theme) => ({

})

class RacesSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = data.sitePage.context
    try {
      window.addEventListener('load', () => {
        racesInit(`${reportsPath}${name}`, 'Test', templateDPS)
      })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {data, i18nPlugin} = this.props
    const {t} = i18nPlugin
    const {name} = data.sitePage.context
    return (
      <div id="herodamage-races">
        <Helmet>
          <script src="https://www.gstatic.com/charts/loader.js"/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>If you are interested in how the different races in World of Warcraft compare for this build, you can
          check
          out the following chart. However, keep in mind that race differences are usually rather small and can change
          with balance and gameplay changes. You can always play the race you want to play and don&apos,t have to feel
          compelled to choose based on this chart.</Trans></p>
        <CircularProgress id="herodamage-loading" color="secondary" style={{margin: 'auto'}}/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 500, width: '100%'}}/>
      </div>
    )
  }
}

RacesSimulationTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  i18nPlugin: PropTypes.object
}

export default withI18n()(withStyles(styles)(RacesSimulationTemplate))

export const query = graphql`
  query RacesSimulation($slugIntl: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    sitePage(path: {eq: $slugIntl}) {
      context {
        name
        fightStyle
        tier
        spec
        variation
        targetError
        resultTime
        version
        build
        buildTime
        gitRevision
        templateDPS
      }
    }
  }
`
