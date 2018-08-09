import React from 'react'
import { Trans } from '@lingui/react'
import StackedChartLayout from './common/stacked-chart-layout'

const RacesSimulationTemplate = (props) => (
  <StackedChartLayout {...props} chartTitle="Race % DPS Gain">
    <div>
      <p><Trans>If you are interested in how the different races in World of Warcraft compare for this build, you can
        check out the following chart. However, keep in mind that race differences are usually rather small and can
        change with balance and gameplay changes. You can always play the race you want to play and don&apos,t have
        to feel compelled to choose based on this chart.</Trans></p>
    </div>
  </StackedChartLayout>
)

export default RacesSimulationTemplate

export const query = graphql`
  query RacesSimulation($lang: String!, $wowClass: String!, $spec: String!, $simulationType: String!, $tier: String!, $variation: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, spec: {eq: $spec}, simulationType: {eq: $simulationType}, tier: {eq: $tier}, variation: {eq: $variation}}}) {
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
