// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
// Components
import { DateFormat, Trans } from '@lingui/react'

const Metas = ({ simcBuildTimestamp, simcGitRevision, targetError, templateDPS, wowVersion }) => {
  const buildDate = new Date(simcBuildTimestamp * 1000)
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <p>
        <Trans><b>Last Update:</b></Trans>&nbsp;
        <DateFormat value={buildDate}
          format={{ month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }}/> (CEST)<br/>
        <Trans><b>WoW-Build:</b></Trans> {wowVersion}
        <a href={`https://github.com/simulationcraft/simc/commits/${simcGitRevision}`}
          title="Corresponding SimC commit">#{simcGitRevision}</a><br/>
        <Trans><b>Target Error:</b></Trans> {targetError}% (~{Math.round(templateDPS * targetError / 100)} DPS)
      </p>
    </div>
  )
}

Metas.propTypes = {
  simcBuildTimestamp: PropTypes.number.isRequired,
  simcGitRevision: PropTypes.string.isRequired,
  targetError: PropTypes.number.isRequired,
  templateDPS: PropTypes.number.isRequired,
  wowVersion: PropTypes.string.isRequired
}

export default Metas
