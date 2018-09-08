// Dependencies
import merge from 'lodash/merge'
import { getAzeriteInformation, getTalentsTree } from '../../../utils/wow/core'
import { wowAzeriteLabel, wowTalentsLabel } from '../../../utils/wow/ui'

export async function getResultsStates (props, filepath) {
  const { i18nPlugin: { lang }, pageContext } = props
  const { spec, wowClass } = pageContext

  // Fetch the .json
  const response = await window.fetch(filepath)
  const { results: jsonResults } = await response.json()

  // Iterate over the results to add some information
  const results = []
  const multiTargets = jsonResults[0].length === 6 // whether the results contains a bossDPS column
  const maxDPS = jsonResults[0][4] // used to compute the % Diff
  const selectedTalents = {} // used for talents filter
  const selectedAzeritePowers = {} // used for azerite filter
  for (let row of jsonResults) {
    // result filtering
    const talents = row[1]
    const azeritePower = row[3]
    const dps = row[4]
    const result = { rank: row[0], talents, azeritePower, dps }
    if (multiTargets) result.bossDPS = row[5]
    result.talentsLabel = wowTalentsLabel(talents, wowClass, spec, lang)
    result.azeritePowerLabel = azeritePower !== 'None' ? wowAzeriteLabel(azeritePower, lang, false) + ' (x1)' : 'None'
    result.dpsPercentageDifference = (100 * dps / maxDPS - 100).toFixed(1)
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
    if (azeritePower !== 'None') {
      if (!selectedAzeritePowers[azeritePower]) {
        const { spellId, tier } = getAzeriteInformation(azeritePower)
        selectedAzeritePowers[azeritePower] = {
          spellName: azeritePower,
          selected: true,
          spellId,
          tier
        }
      }
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

  return { multiTargets, results, selectedAzeritePowers, talentsTree }
}
