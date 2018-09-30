// Dependencies
import merge from 'lodash/merge'
import { getAzeriteInformationByName, getTalentsTree } from '../../../utils/wow/core'
import { wowAzeriteLabel, wowTalentsLabel } from '../../../utils/wow/ui'

function getStacksCount (simulationType) {
  if (simulationType === 'combinations-default') return 1
  return parseInt(simulationType.split('-')[1].charAt(0))
}

export function getResultsStates (props) {
  const { i18nPlugin: { lang }, pageContext } = props
  const { resultsRaw, spec, wowClass, simulationType } = pageContext

  const jsonResults = JSON.parse(resultsRaw)
  const stacksCount = getStacksCount(simulationType)

  // Iterate over the results to add some information
  const results = []
  const multiTargets = jsonResults[0].length === 6 // whether the results contains a bossDPS column
  const maxDPS = jsonResults[0][4] // used to compute the % Diff
  const selectedTalents = {} // used for talents filter
  const azeritePowersFilter = {} // used for azerite filter
  for (let row of jsonResults) {
    // result filtering
    const talents = row[1]
    const azeritePowers = row[3]
    const dps = row[4]
    const result = { rank: row[0], talents, azeritePowers, dps }
    if (multiTargets) result.bossDPS = row[5]
    result.talentsLabel = wowTalentsLabel(talents, wowClass, spec, lang)
    result.dpsPercentageDifference = (100 * dps / maxDPS - 100).toFixed(1)
    const azeritePowersArray = azeritePowers.split(' / ')
    let azeritePowerLabels = []
    for (const azeritePower of azeritePowersArray) {
      if (azeritePower === 'None') {
        azeritePowerLabels.push('None')
        continue
      }
      azeritePowerLabels.push(wowAzeriteLabel(azeritePower, wowClass, spec, talents, lang, false) + ` (x${stacksCount})`)
    }
    result.azeritePowerLabel = azeritePowerLabels.join(' ')
    results.push(result)

    // filter the talents to get the ones that can be selected
    for (let row = 0; row < talents.length; row++) {
      if (!selectedTalents[row]) selectedTalents[row] = {}
      const talentChar = parseInt(talents.charAt(row))
      if (talentChar !== 0) {
        const col = talentChar - 1
        if (!selectedTalents[row][col]) selectedTalents[row][col] = { selected: true }
      }
    }

    // filter the azerite powers to get the ones that can be selected
    for (const azeritePower of azeritePowersArray) {
      if (simulationType === 'combinations-default' || azeritePower === 'None') continue
      if (azeritePowersFilter[azeritePower]) continue
      const { spellId, tier, classesId } = getAzeriteInformationByName(azeritePower)
      azeritePowersFilter[azeritePower] = { spellName: azeritePower, selected: true, spellId, tier, classesId }
    }
  }

  // disable the talents that weren't found
  for (let rowId in selectedTalents) {
    for (let col = 0; col < 3; col++) {
      if (!selectedTalents[rowId][col]) {
        selectedTalents[rowId][col] = { disabled: true }
      }
    }
  }
  // merge the base talentsTree with the ones selected
  const defaultTalentsTree = getTalentsTree(wowClass, spec)
  const talentsTree = {}
  merge(talentsTree, defaultTalentsTree, selectedTalents)

  return { multiTargets, results, azeritePowersFilter, talentsTree }
}
