import React from 'react'

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

export default RacesSimulationTemplate

export const query = graphql`
  query RacesSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $tier: String!, $spec: String!, $fightStyle: String!, $variation: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    relatedSimulationTypes: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, tier: {eq: $tier}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}, variation: {eq: $variation}}}, sort: {fields: [context___order], order: ASC}) {
      edges {
        node {
          path
          context {
            simulationType
          }
        }
      }
    }
    relatedTiers: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}, variation: {eq: $variation}}}, sort: {fields: [context___tier], order: ASC}) {
      edges {
        node {
          path
          context {
            tier
          }
        }
      }
    }
    relatedSpecs: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, fightStyle: {eq: $fightStyle}}}, sort: {fields: [context___spec, context___variation], order: ASC}) {
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
