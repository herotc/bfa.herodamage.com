import React from 'react'
import PropTypes from 'prop-types'
import { Trans, withI18n } from '@lingui/react'
import { withStyles } from '@material-ui/core/styles/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import { trinketsInit } from '../../browser/charts/trinkets'

const styles = (theme) => ({})

class TrinketsSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = data.sitePage.context
    try {
      trinketsInit(`${reportsPath}${name}`, 'Test', templateDPS)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {data, i18nPlugin} = this.props
    const {t} = i18nPlugin
    const {name} = data.sitePage.context
    return (
      <div>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>Here, you can compare expected DPS increase from trinkets.</Trans></p>
        <p><Trans>In order to compare trinkets with this chart, look for the end of the bars corresponding to the item
          level of interest. However, you should <b>simulate your own character</b> to find your best setup. These
          simulations are based on predefined gear sets instead of your own, after all. This means data shown here <b>depends
            heavily</b> on the used profile with its talents, legendaries etc. and is rather giving an outlook. If your
          character is different from the setup used here, personal simulations are recommended.</Trans></p>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 500, width: '100%'}}/>
      </div>
    )
  }
}

TrinketsSimulationTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  i18nPlugin: PropTypes.object
}

export default withI18n()(withStyles(styles)(TrinketsSimulationTemplate))

export const query = graphql`
  query TrinketsSimulation($slugIntl: String!) {
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

