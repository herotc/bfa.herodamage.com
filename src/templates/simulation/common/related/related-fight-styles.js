// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

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

export default RelatedFightStyles
