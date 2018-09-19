// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { getSpec, getSpecVariation } from '../../../../utils/wow/ui'
// Components
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const RelatedSpecs = ({ data: { relatedSpecWithVariations }, spec, variation, t }) => {
  if (!relatedSpecWithVariations || relatedSpecWithVariations.edges.length <= 1) return null
  const relatedSpecs = relatedSpecWithVariations.edges.filter((edge) => {
    return edge.node.context.variation === ''
  })
  const relatedVariations = relatedSpecWithVariations.edges.filter((edge) => {
    return edge.node.context.spec === spec
  })
  return (
    <>
      {relatedSpecs.length >= 1 &&
      <div>
        <Divider/>
        {relatedSpecs.map((edge, index) => {
          const { node: { context, path } } = edge
          const { spec: nodeSpec } = context
          return (
            <Button key={index} variant="contained" color="primary"
              disabled={spec === nodeSpec}
              component={Link} to={path} style={{ margin: '4px 8px' }}>
              {getSpec(t, nodeSpec, false)}
            </Button>
          )
        })}
      </div>}
      {relatedVariations.length > 1 &&
      <div>
        <Divider/>
        {relatedVariations.map((edge, index) => {
          const { node: { context, path } } = edge
          const { variation: nodeVariation } = context
          return (
            <Button key={index} variant="contained" color="primary"
              disabled={variation === nodeVariation}
              component={Link} to={path} style={{ margin: '4px 8px' }}>
              {getSpecVariation(t, nodeVariation !== '' ? nodeVariation : 'default', false)}
            </Button>
          )
        })}
      </div>}
    </>

  )
}

RelatedSpecs.propTypes = {
  data: PropTypes.object.isRequired,
  spec: PropTypes.string,
  t: PropTypes.func.isRequired,
  variation: PropTypes.string
}

export default RelatedSpecs
