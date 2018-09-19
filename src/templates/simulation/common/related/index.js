// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// Components
import RelatedFightStyles from './related-fight-styles'
import RelatedSimulations from './related-simulations'
import RelatedSpecs from './related-specs'
import RelatedTiers from './related-tiers'

const RelatedContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  display: table;
  margin: auto;
  text-align: center;
`

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
