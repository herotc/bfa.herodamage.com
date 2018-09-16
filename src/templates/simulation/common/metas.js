// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { getWowheadLink } from '../../../utils/wow/ui'
// Components
import { DateFormat, Trans } from '@lingui/react'
import TimeAgo from 'react-timeago'

function timeAgo (date) {
  if (typeof window !== 'undefined') {
    return <><TimeAgo date={date}/>&nbsp;|&nbsp;</>
  }
}

const Metas = ({ i18nPlugin, fightLength, fightLengthVariation, simcBuildTimestamp, simcGitRevision, targetError, templateTalents, templateDPS, wowBuild, wowVersion }) => {
  const buildDate = new Date(simcBuildTimestamp * 1000)
  const lang = i18nPlugin?.lang
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <p>
        <Trans><b>Last Update:</b></Trans>&nbsp;{timeAgo(buildDate)}
        <DateFormat value={buildDate}
          format={{ month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }}/> (CEST)<br/>
        <Trans><b>WoW-Build:</b></Trans> {wowVersion}.{wowBuild}&nbsp;
        <a href={`https://github.com/simulationcraft/simc/commits/${simcGitRevision}`}
          title="Corresponding SimC commit">#{simcGitRevision}</a><br/>
        <Trans><b>Target Error:</b></Trans> {targetError}% (~{Math.round(templateDPS * targetError / 100)} DPS)<br/>
        <Trans><b>Fight Length:</b></Trans>&nbsp;
        {(fightLength * (1 - fightLengthVariation) / 60).toFixed(1)} -&nbsp;
        {(fightLength * (1 + fightLengthVariation) / 60).toFixed(1)} minutes
        {templateTalents && lang &&
        <>
          <br/>
          <Trans><b>Talents:</b></Trans>&nbsp;
          {templateTalents.map((spellId) => (
            <a key={spellId} href={`${getWowheadLink(lang)}spell=${spellId}`} data-wh-rename-link="false"/>
          ))}
        </>
        }
      </p>
    </div>
  )
}

Metas.propTypes = {
  i18nPlugin: PropTypes.object,
  fightLength: PropTypes.number.isRequired,
  fightLengthVariation: PropTypes.number.isRequired,
  simcBuildTimestamp: PropTypes.number.isRequired,
  simcGitRevision: PropTypes.string.isRequired,
  targetError: PropTypes.number.isRequired,
  templateTalents: PropTypes.array,
  templateDPS: PropTypes.number.isRequired,
  wowBuild: PropTypes.number.isRequired,
  wowVersion: PropTypes.string.isRequired
}

export default Metas
