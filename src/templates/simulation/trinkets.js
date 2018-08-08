import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import { Trans } from '@lingui/react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { trinketsInit } from '../../browser/charts/trinkets'
import GoogleAd from '../../components/google-ad'

class TrinketsSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = pathContext
    try {
      trinketsInit(`${reportsPath}${name}`, 'Trinkets % DPS Gain per Item Levels', templateDPS)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {data, i18nPlugin, location, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {t} = i18nPlugin
    const {name, fightStyle} = pathContext
    return (
      <div>
        <Helmet>
          <link rel="prefetch" href={`${reportsPath}${name}.json`}/>
        </Helmet>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>Here, you can compare expected DPS increase from trinkets.</Trans></p>
        <p><Trans>In order to compare trinkets with this chart, look for the end of the bars corresponding to the item
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
                  {t(nodeFightStyle)}
                </Button>
              )
            })
          }
        </div>
        <GoogleAd location={location} type="inarticle"/>
        <CircularProgress id="results-loader" color="secondary"/>
        <div id="chart-overlay"/>
        <div id="google-chart" style={{height: 750, width: '100%'}}/>
      </div>
    )
  }
}

TrinketsSimulationTemplate.propTypes = {
  data: PropTypes.object,
  i18nPlugin: PropTypes.object,
  location: PropTypes.object,
  pathContext: PropTypes.object
}

export default TrinketsSimulationTemplate

export const query = graphql`
  query TrinketsSimulation($lang: String!, $wowClass: String!, $spec: String!, $simulationType: String!, $tier: String!, $variation: String!) {
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
