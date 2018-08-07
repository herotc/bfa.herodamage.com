import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import { Trans } from '@lingui/react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { azeriteLevelsInit } from '../../browser/charts/azeritelevels'
import GoogleAd from '../../components/google-ad'

class AzeriteLevelsSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = pathContext
    azeriteLevelsInit(`${reportsPath}${name}`, 'Azerite Powers % DPS Gain per Item Levels', templateDPS)
      .catch((err) => { console.error(err) })
  }

  render () {
    const {data, location, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, fightStyle} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={`${reportsPath}${name}.json`}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>Here, you can compare expected DPS increase from azerite powers.</Trans></p>
        <p><Trans>In order to compare azerite powers with this chart, look for the end of the bars corresponding to the
          item
          level of interest. However, you should <b>simulate your own character</b> to find your best setup. These
          simulations are based on predefined gear sets instead of your own, after all. This means data shown here <b>depends
            heavily</b> on the used profile with its talents, its gear, etc. and is rather giving an outlook. If your
          character is different from the setup used here, personal simulations are recommended.</Trans></p>
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
        <GoogleAd location={location} type="inarticle"/>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 1200, width: '100%'}}/>
      </div>
    )
  }
}

AzeriteLevelsSimulationTemplate.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  pathContext: PropTypes.object,
  location: PropTypes.object
}

export default AzeriteLevelsSimulationTemplate

export const query = graphql`
  query AzeriteLevelsSimulation($lang: String!, $wowClass: String!, $spec: String!, $simulationType: String!, $tier: String!, $variation: String!) {
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
