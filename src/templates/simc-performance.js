// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import { Chart } from 'react-google-charts'
import RelatedSimulations from './simulation/common/related'

const bgColor = '#303030'
const textColor = 'white'
const options = {
  title: 'SimC Performance',
  backgroundColor: bgColor,
  width: '100%',
  chartArea: {
    top: 50,
    bottom: 100,
    right: 100,
    left: 250
  },
  fontName: '"Roboto", "Helvetica", "Arial", sans-serif',
  titleTextStyle: {
    fontSize: 18,
    color: textColor
  },
  vAxis: {
    textStyle: {
      fontSize: 14,
      color: textColor
    }
  },
  hAxis: {
    textStyle: {
      fontSize: 14,
      color: textColor
    },
    title: 'Iterations per seconds',
    titleTextStyle: {
      fontSize: 18,
      color: textColor
    },
    viewWindowMode: 'maximized',
    viewWindow: {
      min: 0
    }
  }
}

class SimCPerformance extends React.Component {
  render () {
    const { data, i18nPlugin, pageContext } = this.props
    const { t } = i18nPlugin
    const { fightStyle, simulationType, tier } = pageContext
    const chartData = data.statistics.edges.map((edge) => {
      const { context } = edge.node
      const { wowClass, spec, variation, elapsedTime, totalIterations } = context
      return [`${wowClass} - ${spec}${variation && ` - ${variation}`}`, Math.round(totalIterations / elapsedTime)]
    })
    options.height = 130 + chartData.length * 25.5
    chartData.sort((a, b) => b[1] - a[1])
    chartData.unshift(['Name', ''])
    return (
      <div>
        <h1>SimC Performance</h1>
        <RelatedSimulations data={data} fightStyle={fightStyle} simulationType={simulationType} t={t} tier={tier}/>
        <div id="google-chart">
          <Chart chartType="BarChart" data={chartData} options={options}/>
        </div>
      </div>
    )
  }
}

SimCPerformance.propTypes = {
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object,
  pageContext: PropTypes.object.isRequired
}

export default SimCPerformance

export const query = graphql`
  query SimCPerformance($lang: String!, $simulationType: String!, $fightStyle: String!, $tier: String!) {
    statistics: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {ne: null}, simulationType: {eq: $simulationType}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}}}, sort: {fields: [context___elapsedTime], order: DESC}) {
      edges {
        node {
          path
          context {
            wowClass
            spec
            variation
            elapsedTime
            totalIterations
            totalActors
          }
        }
      }
    }
    relatedSimulationTypes: allSitePage(filter: {context: {lang: {eq: $lang}, slug: {regex: "/^\/simc-performance\//i"}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}}}, sort: {fields: [context___order], order: ASC}) {
      edges {
        node {
          path
          context {
            simulationType
          }
        }
      }
    }
    relatedTiers: allSitePage(filter: {context: {lang: {eq: $lang}, slug: {regex: "/^\/simc-performance\//i"}, simulationType: {eq: $simulationType}, fightStyle: {eq: $fightStyle}}}, sort: {fields: [context___tier], order: ASC}) {
      edges {
        node {
          path
          context {
            tier
          }
        }
      }
    }
    relatedFightStyles: allSitePage(filter: {context: {lang: {eq: $lang}, slug: {regex: "/^\/simc-performance\//i"}, simulationType: {eq: $simulationType}, tier: {eq: $tier}}}, sort: {fields: [context___fightStyle], order: ASC}) {
      edges {
        node {
          path
          context {
            fightStyle
          }
        }
      }
    }
  }
`
