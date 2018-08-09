import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Trans } from '@lingui/react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import GoogleAd from '../../components/google-ad'

class CombinationsSimulationTemplate extends React.Component {
  constructor (props) {
    super(props)

    this.state = {results: null}

    this.getResults = this.getResults.bind(this)
  }

  async getResults () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name} = pathContext
    const response = await window.fetch(`${reportsPath}${name}.json`)
    const json = await response.json()
    this.setState({results: json.results})
  }

  componentDidMount () {
    this.getResults().catch((err) => { console.error(err) })
  }

  render () {
    const {data, i18nPlugin, location, pathContext} = this.props
    const {t} = i18nPlugin
    const {name, fightStyle, targetError} = pathContext
    const {results} = this.state
    return (
      <div>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans><b>Information:</b><br/>These simulations are all based on the default profiles from
          SimulationCraft.<br/>The target error was {targetError}% which means you can consider everything within that
          DPS range to be mostly equal and requiring a more detailed investigation.</Trans></p>
        <p><Trans>The purpose of these simulations is to get a general idea of how different setups will compare with
          each other and not to promote any definitive best builds. Several variables (like different trinkets, WF/TF or
          ingame situations) are not taken into account. This is why you, as always, should <u><b>simulate your own
            character</b></u> to find your optimal setup.</Trans></p>
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
      </div>
    )
  }
}

CombinationsSimulationTemplate.propTypes = {
  data: PropTypes.object,
  i18nPlugin: PropTypes.object,
  location: PropTypes.object,
  pathContext: PropTypes.object
}

export default CombinationsSimulationTemplate

export const query = graphql`
  query CombinationsSimulation($lang: String!, $wowClass: String!, $spec: String!, $simulationType: String!, $tier: String!, $variation: String!) {
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
