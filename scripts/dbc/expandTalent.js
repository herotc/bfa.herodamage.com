import { writeFile } from 'fs'
import TalentRaw from '../../src/assets/wow-data/raw/Talent.json'

export function expandTalent () {
  const mapping = Object.assign({}, TalentRaw)
  const spellIdsToColumn = { 0: '0' }

  for (const classId in mapping) {
    if (!mapping.hasOwnProperty(classId)) continue
    const classTalents = mapping[classId]
    const sharedTalents = classTalents[0]

    for (const specId in classTalents) {
      if (!classTalents.hasOwnProperty(specId) || specId === 0) continue
      const specTalents = classTalents[specId]

      for (let rowId = 0; rowId < 7; rowId++) {
        // Add missing shared row
        if (!specTalents[rowId]) {
          specTalents[rowId] = sharedTalents[rowId]
          continue
        }

        for (let colId = 0; colId < 3; colId++) {
          // Add missing shared column
          if (!specTalents[rowId][colId]) {
            specTalents[rowId][colId] = sharedTalents[rowId][colId]
          }

          // Save the spellId and its colId
          const column = specTalents[rowId][colId]
          if (column && !spellIdsToColumn[column.spellId]) {
            spellIdsToColumn[column.spellId] = (colId + 1).toString()
          }
        }
      }
    }
    delete classTalents[0]
  }

  const Talent = {
    mapping,
    spellIdsToColumn
  }

  writeFile('src/assets/wow-data/Talent.json', JSON.stringify(Talent), (err) => { if (err) console.err(err) })
}
