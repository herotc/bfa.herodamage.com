import React from 'react'

import { Trans } from '@lingui/react'

import StackedChartLayout from './common/stacked-chart-layout'

const AzeriteStacksSimulationTemplate = (props) => (
  <StackedChartLayout {...props} chartTitle="Azerite Powers % DPS Gain per Stacks">
    <div>
      <p><Trans>Here, you can compare expected DPS increase from azerite powers.</Trans></p>
      <p><Trans>In order to compare azerite powers with this chart, look for the end of the bars corresponding to the
        item
        level of interest. However, you should <b>simulate your own character</b> to find your best setup. These
        simulations are based on predefined gear sets instead of your own, after all. This means data shown here <b>depends
          heavily</b> on the used profile with its talents, its gear, etc. and is rather giving an outlook. If your
        character is different from the setup used here, personal simulations are recommended.</Trans></p>
    </div>
  </StackedChartLayout>
)

export default AzeriteStacksSimulationTemplate

export const query = graphql`
  query AzeriteStacksSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $tier: String!, $spec: String!, $fightStyle: String!, $variation: String!) {
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
    relatedTiers: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}, variation: {eq: $variation}}}) {
      edges {
        node {
          path
          context {
            tier
          }
        }
      }
    }
    relatedFightStyles: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, spec: {eq: $spec}, variation: {eq: $variation}}}) {
      edges {
        node {
          path
          context {
            fightStyle
          }
        }
      }
    }
    relatedVariations: allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, spec: {eq: $spec}, fightStyle: {eq: $fightStyle}}}) {
      edges {
        node {
          path
          context {
            variation
          }
        }
      }
    }
  }
`
