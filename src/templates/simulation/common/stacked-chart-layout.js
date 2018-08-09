import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import CircularProgress from '@material-ui/core/CircularProgress'

import { stackedChart } from '../../../browser/charts/stacked'

import RelatedSimulations from './related'
import GoogleAd from '../../../components/google-ad'

class StackedChartLayout extends React.Component {
  constructor (props) {
    super(props)

    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name} = pathContext
    this.state = {
      filePath: `${reportsPath}${name}.json`
    }
  }

  componentDidMount () {
    const {chartTitle, pathContext} = this.props
    const {filePath} = this.state
    const {simulationType, templateDPS} = pathContext
    stackedChart(simulationType, filePath, chartTitle, templateDPS)
      .catch((err) => { console.error(err) })
  }

  render () {
    const {children, data, i18nPlugin, location, pathContext} = this.props
    const {filePath} = this.state
    const {t} = i18nPlugin
    const {name, fightStyle, simulationType, tier, variation} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={filePath}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        {children}
        <RelatedSimulations data={data} fightStyle={fightStyle} simulationType={simulationType}
          t={t} tier={tier} variation={variation}/>
        <GoogleAd location={location} type="inarticle"/>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart"/>
      </div>
    )
  }
}

StackedChartLayout.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pathContext: PropTypes.object.isRequired
}

export default StackedChartLayout
