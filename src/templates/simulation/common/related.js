// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { getSpecVariation } from '../../../utils/wow/ui'
// Components
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const RelatedContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  display: table;
  margin: auto;
  text-align: center;
`

const RelatedSimulations = ({ data: { relatedSimulations }, simulationFeaturedOrder, simulationCategory, simulationType, t }) => {
  if (!relatedSimulations || relatedSimulations.edges.length <= 1) return null
  const relatedSimulationCategories = relatedSimulations.edges.filter((edge) => {
    return !!edge.node.context.simulationFeaturedOrder
  })
  const relatedSimulationTypes = relatedSimulations.edges.filter((edge) => {
    return edge.node.context.simulationCategory === simulationCategory
  })
  return (
    <>
      {relatedSimulationCategories.length > 1 &&
      <div>
        {relatedSimulationCategories.map((edge, index) => {
          const { node: { context, path } } = edge
          const { simulationCategory: nodeSimulationCategory } = context
          return (
            <Button key={index} variant="contained" color="primary"
              disabled={simulationCategory === nodeSimulationCategory}
              component={Link} to={path} style={{ margin: '4px 8px' }}>
              {t(nodeSimulationCategory)}
            </Button>
          )
        })}
      </div>}
      {relatedSimulationTypes.length > 1 &&
      <div>
        <Divider/>
        {relatedSimulationTypes.map((edge, index) => {
          const { node: { context, path } } = edge
          const { simulationType: nodeSimulationType } = context
          return (
            <Button key={index} variant="contained" color="primary"
              disabled={simulationType === nodeSimulationType}
              component={Link} to={path} style={{ margin: '4px 8px' }}>
              {t(nodeSimulationType)}
            </Button>
          )
        })}
      </div>}
    </>
  )
}

RelatedSimulations.propTypes = {
  data: PropTypes.object.isRequired,
  simulationFeaturedOrder: PropTypes.number,
  simulationCategory: PropTypes.string,
  simulationType: PropTypes.string,
  t: PropTypes.func.isRequired
}

const RelatedTiers = ({ data: { relatedTiers }, t, tier }) => {
  if (!relatedTiers || relatedTiers.edges.length <= 1) return null
  return (
    <div>
      <Divider/>
      {relatedTiers.edges.map((edge, index) => {
        const { node: { context, path } } = edge
        const { tier: nodeTier } = context
        return (
          <Button key={index} variant="contained" color="primary" disabled={tier === nodeTier}
            component={Link} to={path} style={{ margin: '4px 8px' }}>
            {t(nodeTier)}
          </Button>
        )
      })}
    </div>
  )
}

RelatedTiers.propTypes = {
  data: PropTypes.object,
  t: PropTypes.func.isRequired,
  tier: PropTypes.string
}

const RelatedSpecs = ({ data: { relatedSpecs }, spec, variation, t }) => {
  if (!relatedSpecs || relatedSpecs.edges.length <= 1) return null
  return (
    <div>
      <Divider/>
      {relatedSpecs.edges.map((edge, index) => {
        const { node: { context, path } } = edge
        const { spec: nodeSpec, variation: nodeVariation } = context
        return (
          <Button key={index} variant="contained" color="primary"
            disabled={spec === nodeSpec && variation === nodeVariation}
            component={Link} to={path} style={{ margin: '4px 8px' }}>
            {getSpecVariation(t, nodeSpec, nodeVariation, false)}
          </Button>
        )
      })}
    </div>
  )
}

RelatedSpecs.propTypes = {
  data: PropTypes.object.isRequired,
  spec: PropTypes.string,
  t: PropTypes.func.isRequired,
  variation: PropTypes.string
}

const RelatedFightStyles = ({ data: { relatedFightStyles }, fightStyle, t }) => {
  if (!relatedFightStyles || relatedFightStyles.edges.length <= 1) return null
  return (
    <div>
      <Divider/>
      {relatedFightStyles.edges.map((edge, index) => {
        const { node: { context, path } } = edge
        const { fightStyle: nodeFightStyle } = context
        return (
          <Button key={index} variant="contained" color="primary" disabled={fightStyle === nodeFightStyle}
            component={Link} to={path} style={{ margin: '4px 8px' }}>
            {`[${nodeFightStyle.toUpperCase()}] ${t(`fightstyle-${nodeFightStyle}`)}`}
          </Button>
        )
      })}
    </div>
  )
}

RelatedFightStyles.propTypes = {
  data: PropTypes.object.isRequired,
  fightStyle: PropTypes.string,
  t: PropTypes.func.isRequired
}

const Related = ({ data, fightStyle, simulationFeaturedOrder, simulationCategory, simulationType, spec, t, tier, variation }) => (
  <RelatedContainer>
    <RelatedSimulations data={data} simulationFeaturedOrder={simulationFeaturedOrder}
      simulationCategory={simulationCategory} simulationType={simulationType} t={t}/>
    <RelatedTiers data={data} tier={tier} t={t}/>
    <RelatedSpecs data={data} spec={spec} variation={variation} t={t}/>
    <RelatedFightStyles data={data} fightStyle={fightStyle} t={t}/>
  </RelatedContainer>
)

Related.propTypes = {
  data: PropTypes.object.isRequired,
  fightStyle: PropTypes.string,
  simulationFeaturedOrder: PropTypes.number,
  simulationCategory: PropTypes.string,
  simulationType: PropTypes.string,
  spec: PropTypes.string,
  t: PropTypes.func.isRequired,
  tier: PropTypes.string,
  variation: PropTypes.string
}

export default Related
