import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import { Trans } from '@lingui/react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { racesInit } from '../../browser/charts/races'
import GoogleAd from '../../components/google-ad'

const styles = (theme) => ({})

class RacesSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = pathContext
    try {
      racesInit(`${reportsPath}${name}`, 'Race % DPS Gain', templateDPS)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, fightStyle} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={`${reportsPath}${name}.json`}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>If you are interested in how the different races in World of Warcraft compare for this build, you can
          check out the following chart. However, keep in mind that race differences are usually rather small and can
          change with balance and gameplay changes. You can always play the race you want to play and don&apos,t have
          to feel compelled to choose based on this chart.</Trans></p>
        <div style={{textAlign: 'center'}}>
          {
            data.allSitePage.edges.map((edge, index) => {
              const {node} = edge
              const {fightStyle: nodeFightStyle} = node.context
              return (
                <Button key={index} variant="contained" color="primary" disabled={fightStyle === nodeFightStyle}
                  component={Link} to={node.path} style={{margin: 8}}>
                  {nodeFightStyle}
                </Button>
              )
            })
          }
        </div>
        <GoogleAd type="inarticle"/>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 500, width: '100%'}}/>
      </div>
    )
  }
}

RacesSimulationTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  pathContext: PropTypes.object
}

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
