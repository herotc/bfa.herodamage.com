// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import { DateFormat, Trans } from '@lingui/react'

const Metas = ({ buildTime, gitRevision, targetError, templateDPS, version }) => {
  const buildDate = new Date(buildTime * 1000)
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <p>
        <Trans><b>Last Update:</b></Trans>&nbsp;
        <DateFormat value={buildDate}
          format={{ month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }}/> (CEST)<br/>
        <Trans><b>WoW-Build:</b></Trans> {version}
        <a href={`https://github.com/simulationcraft/simc/commit/${gitRevision}`} title="Corresponding SimC commit"
          target="_blank" rel="noopener noreferrer nofollow">#{gitRevision}</a><br/>
        <Trans><b>Target Error:</b></Trans> {targetError}% (~{Math.round(templateDPS * targetError / 100)} DPS)
      </p>
    </div>
  )
}

Metas.propTypes = {
  buildTime: PropTypes.number.isRequired,
  gitRevision: PropTypes.string.isRequired,
  targetError: PropTypes.number.isRequired,
  templateDPS: PropTypes.number.isRequired,
  version: PropTypes.string.isRequired
}

export default Metas
