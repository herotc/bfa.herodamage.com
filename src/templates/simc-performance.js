// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getWowClassColor } from '../utils/wow/core'
import { getSpecWithVariation } from '../utils/wow/ui'
// Components
import { Chart } from 'react-google-charts'
import Related from './simulation/common/related'

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

const sortASC = (a, b) => a[1] - b[1]
const sortDESC = (a, b) => b[1] - a[1]
const chartDataLabels = ['Name', '', { role: 'style' }]

const SimCPerformance = ({ data, i18nPlugin, pageContext }) => {
  const { t } = i18nPlugin
  const { fightStyle, simulationFeaturedOrder, simulationCategory, simulationType, tier } = pageContext

  // Some reports may not entirely exists since we do combine ourself the parameters assuming everything exists
  if (!data.statistics) {
    return (
      <div>
        <h1>SimC Performance</h1>
        <Related data={data} fightStyle={fightStyle} simulationFeaturedOrder={simulationFeaturedOrder}
          simulationCategory={simulationCategory} simulationType={simulationType} t={t} tier={tier}/>
        <div><p>No statistics found.</p></div>
      </div>
    )
  }

  const baseChartData = data.statistics.edges.map((edge) => {
    const { context } = edge.node
    const { wowClass, spec, variation, elapsedTime, totalEventsProcessed, totalIterations, totalActors } = context
    return [
      getSpecWithVariation(t, spec, variation),
      { elapsedTime, totalEventsProcessed, totalIterations, totalActors },
      `color: ${getWowClassColor(wowClass)}`
    ]
  })
  options.height = 80 + baseChartData.length * 25.5

  // Avg. Iterations per second [totalIterations / elapsedTime]
  const ipsData = baseChartData.map((data) => {
    const { elapsedTime, totalIterations } = data[1]
    return [data[0], Math.round(totalIterations / elapsedTime), data[2]]
  })
  ipsData.sort(sortDESC)
  ipsData.unshift(chartDataLabels)

  // Avg. Events processed per iteration [totalEventsProcessed / totalIterations]
  const eventsIterationData = baseChartData.map((data) => {
    const { totalEventsProcessed, totalIterations } = data[1]
    return [data[0], Math.round(totalEventsProcessed / totalIterations), data[2]]
  })
  eventsIterationData.sort(sortASC)
  eventsIterationData.unshift(chartDataLabels)

  // Avg. Duration (μs) per iteration [elapsedTime * 1000000 / totalIterations]
  const durationIterationData = baseChartData.map((data) => {
    const { elapsedTime, totalIterations } = data[1]
    return [data[0], Math.round(elapsedTime * 1000000 / totalIterations), data[2]]
  })
  durationIterationData.sort(sortASC)
  durationIterationData.unshift(chartDataLabels)

  // Avg. Duration (ms) per actor for % target error [elapsedTime * 1000 / totalActors]
  const durationTargetErrorData = baseChartData.map((data) => {
    const { elapsedTime, totalActors } = data[1]
    return [data[0], Math.round(elapsedTime * 1000 / totalActors), data[2]]
  })
  durationTargetErrorData.sort(sortASC)
  durationTargetErrorData.unshift(chartDataLabels)

  // Avg. Iterations per actor for % target error [totalIterations / totalActors]
  const iterationsTargetErrorData = baseChartData.map((data) => {
    const { totalIterations, totalActors } = data[1]
    return [data[0], Math.round(totalIterations / totalActors), data[2]]
  })
  iterationsTargetErrorData.sort(sortASC)
  iterationsTargetErrorData.unshift(chartDataLabels)

  return (
    <div>
      <h1>SimC Performance</h1>
      <Related data={data} fightStyle={fightStyle} simulationFeaturedOrder={simulationFeaturedOrder}
        simulationCategory={simulationCategory} simulationType={simulationType} t={t} tier={tier}/>
      <div>
        <Chart chartType="BarChart" data={ipsData}
          options={{ ...options, title: 'Avg. Iterations per second [iterations / time]' }}/>
      </div>
      <div>
        <Chart chartType="BarChart" data={eventsIterationData}
          options={{ ...options, title: 'Avg. Events processed per iteration [events / iterations]' }}/>
      </div>
      <div>
        <Chart chartType="BarChart" data={durationIterationData}
          options={{ ...options, title: 'Avg. Duration (μs) per iteration [time * 1000000 / iterations]' }}/>
      </div>
      <div>
        <Chart chartType="BarChart" data={durationTargetErrorData} options={{
          ...options,
          title: `Avg. Duration (ms) per actor for 0.${simulationType.indexOf('combinations') !== -1 ? '4' : '2'}% Target Error [time * 1000 / actors]`
        }}/>
      </div>
      <div>
        <Chart chartType="BarChart" data={iterationsTargetErrorData} options={{
          ...options,
          title: `Avg. Iterations per actor for 0.${simulationType.indexOf('combinations') !== -1 ? '4' : '2'}% Target Error [iterations / actors]`
        }}/>
      </div>
    </div>
  )
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
            totalEventsProcessed
            totalIterations
            totalActors
          }
        }
      }
    }
    relatedSimulations: allSitePage(filter: {context: {lang: {eq: $lang}, slug: {regex: "/^\/simc-performance\//i"}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}}}, sort: {fields: [context___simulationFeaturedOrder, context___simulationTypeOrder], order: ASC}) {
      edges {
        node {
          path
          context {
            simulationFeaturedOrder
            simulationCategory
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
