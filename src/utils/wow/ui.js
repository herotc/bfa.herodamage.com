// Dependencies
import { getAzeriteInformation, getTalentsTree, getTrinketInformation } from './core'
import truncate from 'lodash/truncate'
import startCase from 'lodash/startCase'
import { defaultLang } from '../../../plugins/gatsby-plugin-herodamage-i18n'
// Assets
import wowClassDeathKnight from '../../assets/images/wow/classpicker/death_knight.svg'
import wowClassDemonHunter from '../../assets/images/wow/classpicker/demon_hunter.svg'
import wowClassDruid from '../../assets/images/wow/classpicker/druid.svg'
import wowClassHunter from '../../assets/images/wow/classpicker/hunter.svg'
import wowClassMage from '../../assets/images/wow/classpicker/mage.svg'
import wowClassMonk from '../../assets/images/wow/classpicker/monk.svg'
import wowClassPaladin from '../../assets/images/wow/classpicker/paladin.svg'
import wowClassPriest from '../../assets/images/wow/classpicker/priest.svg'
import wowClassRogue from '../../assets/images/wow/classpicker/rogue.svg'
import wowClassShaman from '../../assets/images/wow/classpicker/shaman.svg'
import wowClassWarlock from '../../assets/images/wow/classpicker/warlock.svg'
import wowClassWarrior from '../../assets/images/wow/classpicker/warrior.svg'

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

/**
 *
 * @param t
 * @param spec
 * @param variation
 * @param formatted
 * @returns {string}
 */
export function getSpecVariation (t, spec, variation, formatted = true) {
  if (formatted) {
    return `${startCase(t(spec))}${variation !== '' ? ` ${startCase(t(variation))}` : ''}`
  } else {
    return `${t(spec)}${variation !== '' ? ` ${t(variation)}` : ''}`
  }
}

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

export function getWowheadDomain (lang) {
  return wowheadDomains[lang] || 'www'
}

/**
 *
 * @param lang
 * @returns {string}
 */
export function getWowheadLink (lang) {
  const wowheadDomain = getWowheadDomain(lang)
  return `https://${wowheadDomain}.wowhead.com/`
}

/**
 *
 * @param rawSpellName
 * @returns {string}
 */
const truncateOptions = { length: 30 }

export function wowAzeriteLabel (rawSpellName, lang = defaultLang) {
  // Some labels are concatened, like the Alliance / Horde one, we always take the first one
  const spellName = rawSpellName.split(' / ')

  const azeritePower = getAzeriteInformation(spellName[0])
  if (!azeritePower) return truncate(rawSpellName, truncateOptions)

  const { spellId, tier } = azeritePower
  return `<a href="${getWowheadLink(lang)}spell=${spellId}" target="_blank" rel="noopener noreferrer nofollow">
    <span class="azerite-tier${tier}">${truncate(rawSpellName, truncateOptions)}</span>
  </a>`
}

/**
 *
 * @param rawItemName
 * @param lang
 * @returns {string}
 */
export function wowTrinketLabel (rawItemName, lang = defaultLang) {
  const trinket = getTrinketInformation(rawItemName)
  if (!trinket) return truncate(rawItemName, truncateOptions)

  const { itemId } = trinket
  return `<a href="${getWowheadLink(lang)}item=${itemId}" target="_blank" rel="noopener noreferrer nofollow">
    <span>${truncate(rawItemName, truncateOptions)}</span>
  </a>`
}

/**
 *
 * @param talents
 * @param wowClass
 * @param spec
 * @param lang
 * @returns {string}
 */
export function wowTalentsLabel (talents, wowClass, spec, lang = defaultLang) {
  const talentsTree = getTalentsTree(wowClass, spec)
  let label = ''
  for (let row = 0; row < talents.length; row++) {
    const talentChar = parseInt(talents.charAt(row))
    if (talentChar !== 0) {
      const col = talentChar - 1
      const { spellId } = talentsTree[row][col]
      label += `<a href="${getWowheadLink(lang)}spell=${spellId}" target="_blank" rel="noopener noreferrer nofollow">
        </a>`
    }
  }
  return label
}

/**
 * Does refresh any Wowhead links in the DOM
 * @param firstCall
 */
export function refreshWowheadLinks (firstCall = true) {
  const WH = window.WH
  const $WowheadPower = window.$WowheadPower
  if (WH && WH.getLocaleFromDomain && $WowheadPower && $WowheadPower.refreshLinks) {
    $WowheadPower.refreshLinks()
    // Schedule a second refresh 500ms later since Wowhead might not always refresh every links.
    if (firstCall) {
      setTimeout(() => { refreshWowheadLinks(false) }, 500)
    }
  } else {
    setTimeout(refreshWowheadLinks, 250)
  }
}
