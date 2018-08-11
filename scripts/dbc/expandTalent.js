const fs = require('fs')
const Talent = require('../../src/assets/wow-data/Talent.json')

const TalentExpanded = Object.assign({}, Talent)

for (const classId in TalentExpanded) {
  const classTalents = TalentExpanded[classId]
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

fs.writeFile('src/assets/wow-data/TalentExpanded.json', JSON.stringify(TalentExpanded), (err) => { if (err) console.err(err) })
