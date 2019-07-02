import { writeFile } from 'fs'
import AzeriteEssencesRaw from '../../src/assets/wow-data/raw/AzeriteEssence.json'

export function filterAzeriteEssence () {
  const AzeriteEssencesSorted = AzeriteEssencesRaw.sort((a, b) => a.name.localeCompare(b.name))
  const AzeriteEssencesByName = {}
  for (const azeriteEssence of AzeriteEssencesSorted) {
    const { essenceId, itemId, name } = azeriteEssence
    if (!AzeriteEssencesByName[name]) AzeriteEssencesByName[name] = { essenceId, itemId }
  }

  writeFile('src/assets/wow-data/AzeriteEssence.json', JSON.stringify(AzeriteEssencesByName), (err) => { if (err) console.err(err) })
}
