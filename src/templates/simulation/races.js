// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import { Trans } from '@lingui/react'
import StackedChartLayout from './common/stacked-chart-layout'

const RacesSimulationTemplate = (props) => (
  <StackedChartLayout {...props} chartTitle="Race % DPS Gain">
    <div>
      <p><Trans>If you are interested in how the different races in World of Warcraft compare for this build, you can
        check out the following chart. However, keep in mind that race differences are usually rather small and can
        change with balance and gameplay changes. You can always play the race you want to play and do not have
        to feel compelled to choose based on this chart.</Trans></p>
    </div>
  </StackedChartLayout>
)

RacesSimulationTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object
}

export default RacesSimulationTemplate

export const query = graphql`
  query RacesSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $fightStyle: String!, $tier: String!, $spec: String!, $variation: String!) {
    relatedSimulations: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}, spec: {eq: $spec}, variation: {eq: $variation}}}, sort: {fields: [context___simulationTypeOrder, context___simulationFeaturedOrder], order: ASC}) {
      edges {
        node {
          path
          context {
            simulationFeaturedOrder
            simulationCategory
            simulationType
            simulationTypeOrder
          }
        }
      }
    }
    relatedTiers: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, fightStyle: {eq: $fightStyle}, spec: {eq: $spec}, variation: {eq: $variation}}}, sort: {fields: [context___tier], order: ASC}) {
      edges {
        node {
          path
          context {
            tier
          }
        }
      }
    }
    relatedSpecWithVariations: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, fightStyle: {eq: $fightStyle}, tier: {eq: $tier}}}, sort: {fields: [context___spec, context___variation], order: ASC}) {
      edges {
        node {
          path
          context {
            spec
            variation
          }
        }
      }
    }
    relatedFightStyles: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, spec: {eq: $spec}, variation: {eq: $variation}}}, sort: {fields: [context___fightStyle], order: ASC}) {
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
