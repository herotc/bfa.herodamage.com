// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
// Components
import { Trans } from '@lingui/react'
import StackedChartLayout from './common/stacked-chart-layout'

const CorruptionsRelativeSimulationTemplate = (props) => (
  <StackedChartLayout {...props} chartTitle="Average DPS Gain per Point of Corruption">
    <div>
      <p><Trans>Here, you can compare expected DPS increase <b>per point of Corruption</b> from Corrupted gear procs in Patch 8.3.</Trans></p>
      <p><Trans>Corruptions that rank among the top here are very good for the corruption they have on them. This chart can help you
        find corruption combinations when you have multiple options available.
        However, you should <b>simulate your own character</b> to find your best setup. These
        simulations are based on predefined gear sets instead of your own, after all. This means data shown here <b>depends
          heavily</b> on the used profile with its talents, its gear, etc. and is rather giving an outlook. If your
        character is different from the setup used here, personal simulations are recommended.</Trans></p>
    </div>
  </StackedChartLayout>
)

CorruptionsRelativeSimulationTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  i18nPlugin: PropTypes.object
}

export default CorruptionsRelativeSimulationTemplate

export const query = graphql`
  query CorruptionsRelativeSimulation($lang: String!, $wowClass: String!, $simulationType: String!, $fightStyle: String!, $tier: String!, $spec: String!, $variation: String!) {
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
