import { writeFile } from 'fs'
import AzeritePowersRaw from '../../src/assets/wow-data/raw/AzeritePower.json'

export function filterAzeritePower () {
  const AzeritePowersSorted = AzeritePowersRaw.sort((a, b) => a.spellName.localeCompare(b.spellName))
  const AzeritePowers = {}
  for (const azeritePower of AzeritePowersSorted) {
    const { spellName, powerId, spellId, tier, classesId } = azeritePower
    if (!AzeritePowers[spellName]) AzeritePowers[spellName] = { powerId, spellId, tier, classesId }
  }

  writeFile('src/assets/wow-data/AzeritePower.json', JSON.stringify(AzeritePowers), (err) => { if (err) console.err(err) })
}
