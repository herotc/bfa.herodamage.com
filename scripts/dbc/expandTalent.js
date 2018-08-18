const fs = require('fs')
const TalentRaw = require('../../src/assets/wow-data/raw/Talent.json')

const Talents = Object.assign({}, TalentRaw)

for (const classId in Talents) {
  const classTalents = Talents[classId]
  const sharedTalents = classTalents[0]
  for (const specId in classTalents) {
    if (specId === 0) continue
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

fs.writeFile('src/assets/wow-data/Talent.json', JSON.stringify(Talents), (err) => { if (err) console.err(err) })
