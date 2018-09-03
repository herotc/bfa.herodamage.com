// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getWowClassColor } from '../utils/wow/core'
// Components
import { Chart } from 'react-google-charts'
import RelatedSimulations from './simulation/common/related'

const bgColor = '#303030'
const textColor = 'white'
const options = {
  backgroundColor: bgColor,
  width: '100%',
  chartArea: {
    top: 50,
    bottom: 50,
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
    viewWindowMode: 'maximized',
    viewWindow: {
      min: 0
    }
  },
  legend: {
    position: 'none'
  }
}

class SimCPerformance extends React.Component {
  render () {
    const { data, i18nPlugin, pageContext } = this.props
    const { t } = i18nPlugin
    const { fightStyle, simulationType, tier } = pageContext
    const baseChartData = data.statistics.edges.map((edge) => {
      const { context } = edge.node
      const { wowClass, spec, variation, elapsedTime, totalIterations, totalActors } = context
      return [
        `${wowClass} - ${spec}${variation && ` - ${variation}`}`,
        { elapsedTime, totalIterations, totalActors },
        `color: ${getWowClassColor(wowClass)}`
      ]
    })
    options.height = 80 + baseChartData.length * 25.5
    // Avg. Iterations per second per actor
    const ipsData = baseChartData.map((data) => {
      const { elapsedTime, totalIterations, totalActors } = data[1]
      return [data[0], Math.round(totalIterations / totalActors / elapsedTime), data[2]]
    })
    ipsData.sort((a, b) => b[1] - a[1])
    ipsData.unshift(['Name', '', { role: 'style' }])
    // Avg. Duration (ns) per iteration per actor
    const durationIterationData = baseChartData.map((data) => {
      const { elapsedTime, totalIterations, totalActors } = data[1]
      return [data[0], Math.round(elapsedTime * 1000000000 / totalIterations / totalActors), data[2]]
    })
    durationIterationData.sort((a, b) => b[1] - a[1])
    durationIterationData.unshift(['Name', '', { role: 'style' }])
    // Avg. Duration (ms) per actor for % target error
    const durationActorData = baseChartData.map((data) => {
      const { elapsedTime, totalActors } = data[1]
      return [data[0], Math.round(elapsedTime * 1000 / totalActors), data[2]]
    })
    durationActorData.sort((a, b) => b[1] - a[1])
    durationActorData.unshift(['Name', '', { role: 'style' }])
    // Avg. Iterations per actor for % target error
    const iterationsData = baseChartData.map((data) => {
      const { totalIterations, totalActors } = data[1]
      return [data[0], Math.round(totalIterations / totalActors), data[2]]
    })
    iterationsData.sort((a, b) => b[1] - a[1])
    iterationsData.unshift(['Name', '', { role: 'style' }])
    return (
      <div>
        <h1>SimC Performance</h1>
        <RelatedSimulations data={data} fightStyle={fightStyle} simulationType={simulationType} t={t} tier={tier}/>
        <div>
          <Chart chartType="BarChart" data={ipsData}
            options={{ ...options, title: 'SimC Performance - Avg. Iterations per actor per second' }}/>
        </div>
        <div>
          <Chart chartType="BarChart" data={durationIterationData}
            options={{ ...options, title: 'SimC Performance - Avg. Duration (nanosecond) per iteration per actor' }}/>
        </div>
        <div>
          <Chart chartType="BarChart" data={durationActorData} options={{
            ...options,
            title: `SimC Performance - Avg. Duration (millisecond) per actor for 0.${simulationType === 'combinations' ? '4' : '2'}% Target Error`
          }}/>
        </div>
        <div>
          <Chart chartType="BarChart" data={iterationsData} options={{
            ...options,
            title: `SimC Performance - Avg. Iterations per actor for 0.${simulationType === 'combinations' ? '4' : '2'}% Target Error`
          }}/>
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
    statistics: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {ne: null}, simulationType: {eq: $simulationType}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}, spec: {ne: "holy"}}}, sort: {fields: [context___elapsedTime], order: DESC}) {
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
