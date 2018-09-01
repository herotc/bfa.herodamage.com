const fs = require('fs')
const AzeritePowersRaw = require('../../src/assets/wow-data/raw/AzeritePower.json')

const AzeritePowersSorted = AzeritePowersRaw.sort((a, b) => a.spellName.localeCompare(b.spellName))
const AzeritePowers = {}
for (const azeritePower of AzeritePowersSorted) {
  const { spellName, powerId, spellId, tier } = azeritePower
  if (!AzeritePowers[spellName]) AzeritePowers[spellName] = { powerId, spellId, tier }
}

fs.writeFile('src/assets/wow-data/AzeritePower.json', JSON.stringify(AzeritePowers), (err) => { if (err) console.err(err) })
