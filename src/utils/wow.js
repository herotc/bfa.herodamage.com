import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'

import AzeritePowerArray from '../assets/wow-data/AzeritePower.json'
import wowClassDeathKnight from '../assets/images/wow/classpicker/death_knight.svg'
import wowClassDemonHunter from '../assets/images/wow/classpicker/demon_hunter.svg'
import wowClassDruid from '../assets/images/wow/classpicker/druid.svg'
import wowClassHunter from '../assets/images/wow/classpicker/hunter.svg'
import wowClassMage from '../assets/images/wow/classpicker/mage.svg'
import wowClassMonk from '../assets/images/wow/classpicker/monk.svg'
import wowClassPaladin from '../assets/images/wow/classpicker/paladin.svg'
import wowClassPriest from '../assets/images/wow/classpicker/priest.svg'
import wowClassRogue from '../assets/images/wow/classpicker/rogue.svg'
import wowClassShaman from '../assets/images/wow/classpicker/shaman.svg'
import wowClassWarlock from '../assets/images/wow/classpicker/warlock.svg'
import wowClassWarrior from '../assets/images/wow/classpicker/warrior.svg'

const AzeritePowers = Object.assign({}, ...AzeritePowerArray.map((item) => ({[item['spellName']]: item})))
const truncateOptions = {length: 25}

export function wowAzeriteLabel (rawSpellName) {
  const spellName = rawSpellName.split(' / ') // Some labels are concatened, like the Alliance / Horde one, we always take the first one
  console.log(spellName)
  const power = AzeritePowers[spellName[0]]
  const {spellId, tier} = power
  return `<a href="http://www.wowhead.com/spell=${spellId}" target="_blank" rel="noopener noreferrer nofollow">
    <span class="azerite-tier${tier}">${truncate(rawSpellName, truncateOptions)}</span>
  </a>`
}

export function wowIcon (wowClass) {
  switch (wowClass) {
    case 'death-knight':
      return wowClassDeathKnight
    case 'demon-hunter':
      return wowClassDemonHunter
    case 'druid':
      return wowClassDruid
    case 'hunter':
      return wowClassHunter
    case 'mage':
      return wowClassMage
    case 'monk':
      return wowClassMonk
    case 'paladin':
      return wowClassPaladin
    case 'priest':
      return wowClassPriest
    case 'rogue':
      return wowClassRogue
    case 'shaman':
      return wowClassShaman
    case 'warlock':
      return wowClassWarlock
    case 'warrior':
      return wowClassWarrior
  }
}

export function getSpecVariation (t, spec, variation, formatted = true) {
  if (formatted) {
    return `${startCase(t(spec))}${variation !== '' ? ` ${startCase(t(variation))}` : ''}`
  } else {
    return `${t(spec)}${variation !== '' ? ` ${t(variation)}` : ''}`
  }
}
