import { writeFile } from 'fs'
import AzeritePowersRaw from '../../src/assets/wow-data/raw/AzeritePower.json'

export function filterAzeritePower () {
  const AzeritePowersSorted = AzeritePowersRaw.sort((a, b) => a.spellName.localeCompare(b.spellName))
  const AzeritePowersById = {}
  const AzeritePowersByName = {}
  for (const azeritePower of AzeritePowersSorted) {
    const { spellName, powerId, spellId, tier, classesId } = azeritePower
    if (!AzeritePowersById[powerId]) AzeritePowersById[powerId] = { spellId, spellName, tier, classesId }
    if (!AzeritePowersByName[spellName]) AzeritePowersByName[spellName] = { powerId, spellId, tier, classesId }
  }

  writeFile('src/assets/wow-data/AzeritePowerById.json', JSON.stringify(AzeritePowersById), (err) => { if (err) console.err(err) })
  writeFile('src/assets/wow-data/AzeritePowerByName.json', JSON.stringify(AzeritePowersByName), (err) => { if (err) console.err(err) })
}
