import { writeFile } from 'fs'
import CorruptionsRaw from '../../src/assets/wow-data/raw/Corruptions.json'

export function filterCorruptions () {
  const CorruptionsSorted = CorruptionsRaw.sort((a, b) => a.name.localeCompare(b.name))
  const CorruptionsByName = {}
  for (const corruption of CorruptionsSorted) {
    const { spellId, name } = corruption
    if (!CorruptionsByName[name]) CorruptionsByName[name] = { spellId }
  }

  writeFile('src/assets/wow-data/Corruptions.json', JSON.stringify(CorruptionsByName), (err) => { if (err) console.err(err) })
}
