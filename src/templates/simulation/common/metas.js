// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { getWowClassId } from '../../../utils/wow/core'
import { getWowheadLink } from '../../../utils/wow/ui'
// Components
import { DateFormat, Trans } from '@lingui/react'
import TimeAgo from 'react-timeago'

function timeAgo (date) {
  if (typeof window !== 'undefined') {
    return <><TimeAgo date={date}/>&nbsp;|&nbsp;</>
  }
}

const Metas = ({ i18nPlugin, fightLength, fightLengthVariation, simcBuildTimestamp, simulationCategory, simcGitRevision, targetError, templateGear, templateTalents, templateDPS, wowBuild, wowClass, wowVersion }) => {
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
          {templateTalents.map((spellId) => {
            if (spellId === 0) return null
            return <a key={spellId} href={`${getWowheadLink(lang)}spell=${spellId}`} data-wh-rename-link="false"/>
          })}
        </>
        }
        {templateGear && lang &&
        <>
          <br/>
          <Trans><b>Gear:</b></Trans>&nbsp;
          {templateGear.map((simcEncoded) => {
            const parts = simcEncoded.split(',')
            let wowheadArgs = ''
            for (const part of parts) {
              const [option, value] = part.split('=')
              switch (option) {
                case 'id':
                  wowheadArgs += `item=${value}`
                  break
                case 'bonus_id':
                  wowheadArgs += `&bonus=${value.split('/').join(':')}`
                  break
                case 'azerite_powers':
                  if (simulationCategory === 'azerite' || simulationCategory === 'combinations') break
                  const powers = value.split('/')
                  if (!parseInt(powers[0]) <= 12) powers.unshift(getWowClassId(wowClass).toString())
                  wowheadArgs += `&azerite-powers=${powers.join(':')}`
                  break
              }
            }
            return <a key={simcEncoded} href={`${getWowheadLink(lang)}${wowheadArgs}`} data-wh-rename-link="false"/>
          })}
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
  simulationCategory: PropTypes.string,
  targetError: PropTypes.number.isRequired,
  templateGear: PropTypes.array,
  templateTalents: PropTypes.array,
  templateDPS: PropTypes.number.isRequired,
  wowBuild: PropTypes.number.isRequired,
  wowClass: PropTypes.string,
  wowVersion: PropTypes.string.isRequired
}

export default Metas
