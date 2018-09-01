import { writeFile } from 'fs'
import TalentRaw from '../../src/assets/wow-data/raw/Talent.json'

export function expandTalent () {
  const Talents = Object.assign({}, TalentRaw)

  for (const classId in Talents) {
    if (!Talents.hasOwnProperty(classId)) continue
    const classTalents = Talents[classId]
    const sharedTalents = classTalents[0]

    for (const specId in classTalents) {
      if (!classTalents.hasOwnProperty(specId) || specId === 0) continue
      const specTalents = classTalents[specId]

      for (let rowId = 0; rowId < 7; rowId++) {
        if (!specTalents[rowId]) {
          specTalents[rowId] = sharedTalents[rowId]
          continue
        }

        for (let colId = 0; colId < 3; colId++) {
          if (!specTalents[rowId][colId]) {
            specTalents[rowId][colId] = sharedTalents[rowId][colId]
          }
        }
      }
    }
    delete classTalents[0]
  }

  writeFile('src/assets/wow-data/Talent.json', JSON.stringify(Talents), (err) => { if (err) console.err(err) })

}
