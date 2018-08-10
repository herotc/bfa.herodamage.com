import startCase from 'lodash/startCase'
import truncate from 'lodash/truncate'

import { defaultLang } from '../../plugins/gatsby-plugin-herodamage-i18n'

import AzeritePowerArray from '../assets/wow-data/AzeritePower.json'
import TrinketArray from '../assets/wow-data/Trinket.json'
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

/**
 *
 * @param lang
 * @returns {string}
 */
const wowheadDomains = {
  de: 'de',
  en: 'www',
  es: 'es',
  fr: 'fr',
  it: 'it',
  ko: 'ko',
  pt: 'pt',
  ru: 'ru',
  zh: 'cn'
}

function getWowheadLink (lang) {
  const wowheadDomain = wowheadDomains[lang] || 'www'
  return `https://${wowheadDomain}.wowhead.com/`
}

/**
 *
 * @param rawSpellName
 * @returns {string}
 */
const AzeritePowers = Object.assign({}, ...AzeritePowerArray.map((item) => ({[item['spellName']]: item})))
const truncateOptions = {length: 30}

export function wowAzeriteLabel (rawSpellName, lang = defaultLang) {
  const spellName = rawSpellName.split(' / ') // Some labels are concatened, like the Alliance / Horde one, we always take the first one
  const {spellId, tier} = AzeritePowers[spellName[0]]
  return `<a href="${getWowheadLink(lang)}spell=${spellId}" target="_blank" rel="noopener noreferrer nofollow">
    <span class="azerite-tier${tier}">${truncate(rawSpellName, truncateOptions)}</span>
  </a>`
}

/**
 *
 * @param rawItemName
 * @returns {string}
 */
const Trinkets = Object.assign({}, ...TrinketArray.map((item) => ({[item['name']]: item})))

export function wowTrinketLabel (rawItemName, lang = defaultLang) {
  const {itemId} = Trinkets[rawItemName]
  return `<a href="${getWowheadLink(lang)}item=${itemId}" target="_blank" rel="noopener noreferrer nofollow">
    <span>${truncate(rawItemName, truncateOptions)}</span>
  </a>`
}

/**
 * Does refresh any Wowhead links in the DOM
 */
export function refreshWowheadLinks () {
  const $WowheadPower = window.$WowheadPower
  if ($WowheadPower && $WowheadPower.refreshLinks) {
    $WowheadPower.refreshLinks()
  }
}

/**
 *
 * @param wowClass
 */
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
