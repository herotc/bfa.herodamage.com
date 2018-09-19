// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

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

export default RelatedTiers
