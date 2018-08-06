import React from 'react'
import PropTypes from 'prop-types'
import { Trans, withI18n } from '@lingui/react'
import { withStyles } from '@material-ui/core/styles/index'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { racesInit } from '../../browser/charts/races'
import Link from 'gatsby-link/index'

const styles = (theme) => ({

})

class RacesSimulationTemplate extends React.Component {
  componentDidMount () {
    const {data, pathContext} = this.props
    const {reportsPath} = data.site.siteMetadata
    const {name, templateDPS} = pathContext
    try {
      racesInit(`${reportsPath}${name}`, 'Test', templateDPS)
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {data, pathContext} = this.props
    const {name, fightStyle} = pathContext
    return (
      <div>
        <h1>{name.replace(new RegExp('_', 'g'), ' ').replace(new RegExp('-', 'g'), ' ')}</h1>
        <p><Trans>If you are interested in how the different races in World of Warcraft compare for this build, you can
          check
          out the following chart. However, keep in mind that race differences are usually rather small and can change
          with balance and gameplay changes. You can always play the race you want to play and don&apos,t have to feel
          compelled to choose based on this chart.</Trans></p>
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

export default withI18n()(withStyles(styles)(RacesSimulationTemplate))

export const query = graphql`
  query RacesSimulation($lang: String!, $spec: String!, $simulationType: String!, $tier: String!) {
    site {
      siteMetadata {
        reportsPath
      }
    }
    allSitePage(filter: {context: {lang: {eq: $lang}, spec: {eq: $spec}, simulationType: {eq: $simulationType}, tier: {eq: $tier}}}) {
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
