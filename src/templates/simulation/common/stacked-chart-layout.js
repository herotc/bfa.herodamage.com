import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { stackedChart } from '../../../browser/charts/stacked'
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
    const {name, fightStyle} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={filePath}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        {children}
        <div style={{textAlign: 'center'}}>
          {
            data.allSitePage.edges.map((edge, index) => {
              const {node} = edge
              const {fightStyle: nodeFightStyle} = node.context
              return (
                <Button key={index} variant="contained" color="primary" disabled={fightStyle === nodeFightStyle}
                  component={Link} to={node.path} style={{margin: 8}}>
                  {t(nodeFightStyle)}
                </Button>
              )
            })
          }
        </div>
        <GoogleAd location={location} type="inarticle"/>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 1200, width: '100%'}}/>
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
