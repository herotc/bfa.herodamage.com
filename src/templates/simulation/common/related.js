import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Button from '@material-ui/core/Button'

const RelatedSimulationTypes = ({data: {relatedSimulationTypes: {edges}}, simulationType, t}) => {
  if (edges && edges.length > 1) {
    return (
      <div style={{textAlign: 'center'}}>
        {edges.map((edge, index) => {
          const {node} = edge
          const {simulationType: nodeSimulationType} = node.context
          return (
            <Button key={index} variant="contained" color="primary" disabled={simulationType === nodeSimulationType}
              component={Link} to={node.path} style={{margin: 8}}>
              {t(nodeSimulationType)}
            </Button>
          )
        })}
      </div>
    )
  } else {
    return (null)
  }
}

RelatedSimulationTypes.propTypes = {
  data: PropTypes.object.isRequired,
  simulationType: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

const RelatedTiers = ({data: {relatedTiers: {edges}}, t, tier}) => {
  if (edges && edges.length > 1) {
    return (
      <div style={{textAlign: 'center'}}>
        {edges.map((edge, index) => {
          const {node} = edge
          const {tier: nodeTier} = node.context
          return (
            <Button key={index} variant="contained" color="primary" disabled={tier === nodeTier}
              component={Link} to={node.path} style={{margin: 8}}>
              {t(nodeTier)}
            </Button>
          )
        })}
      </div>
    )
  } else {
    return (null)
  }
}

RelatedTiers.propTypes = {
  data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired
}

const RelatedFightStyles = ({data: {relatedFightStyles: {edges}}, fightStyle, t}) => {
  if (edges && edges.length > 1) {
    return (
      <div style={{textAlign: 'center'}}>
        {edges.map((edge, index) => {
          const {node} = edge
          const {fightStyle: nodeFightStyle} = node.context
          return (
            <Button key={index} variant="contained" color="primary" disabled={fightStyle === nodeFightStyle}
              component={Link} to={node.path} style={{margin: 8}}>
              {t(nodeFightStyle)}
            </Button>
          )
        })}
      </div>
    )
  } else {
    return (null)
  }
}

RelatedFightStyles.propTypes = {
  data: PropTypes.object.isRequired,
  fightStyle: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

const RelatedVariations = ({data: {relatedVariations: {edges}}, variation, t}) => {
  if (edges && edges.length > 1) {
    return (
      <div style={{textAlign: 'center'}}>
        {edges.map((edge, index) => {
          const {node} = edge
          const {variation: nodeVariation} = node.context
          return (
            <Button key={index} variant="contained" color="primary" disabled={variation === nodeVariation}
              component={Link} to={node.path} style={{margin: 8}}>
              {t(nodeVariation === '' ? 'Default' : nodeVariation)}
            </Button>
          )
        })}
      </div>
    )
  } else {
    return (null)
  }
}

RelatedVariations.propTypes = {
  data: PropTypes.object.isRequired,
  variation: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
}

const RelatedSimulations = ({data, fightStyle, variation, simulationType, t, tier}) => (
  <div>
    <RelatedSimulationTypes data={data} simulationType={simulationType} t={t}/>
    <RelatedTiers data={data} tier={tier} t={t}/>
    <RelatedFightStyles data={data} fightStyle={fightStyle} t={t}/>
    <RelatedVariations data={data} variation={variation} t={t}/>
  </div>
)

RelatedSimulations.propTypes = {
  data: PropTypes.object.isRequired,
  fightStyle: PropTypes.string.isRequired,
  variation: PropTypes.string.isRequired,
  simulationType: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  tier: PropTypes.string.isRequired
}

export default RelatedSimulations
