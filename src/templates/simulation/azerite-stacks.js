// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import { Trans } from '@lingui/react'
import StackedChartLayout from './common/stacked-chart-layout'

const AzeriteStacksSimulationTemplate = (props) => (
  <StackedChartLayout {...props} chartTitle="Azerite Powers % DPS Gain per Stacks">
    <div>
      <p><Trans>Here, you can compare expected DPS increase from azerite powers.</Trans></p>
      <p><Trans>In order to compare azerite powers with this chart, look for the end of the bars corresponding to the
        item level of interest. However, you should <b>simulate your own character</b> to find your best setup. These
        simulations are based on predefined gear sets instead of your own, after all. This means data shown here <b>depends
          heavily</b> on the used profile with its talents, its gear, etc. and is rather giving an outlook. If your
        character is different from the setup used here, personal simulations are recommended.</Trans></p>
    </div>
  </StackedChartLayout>
)

AzeriteStacksSimulationTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object
}

export default AzeriteStacksSimulationTemplate

export const query = graphql`
  query AzeriteStacksSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $fightStyle: String!, $tier: String!, $spec: String!, $variation: String!) {
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
