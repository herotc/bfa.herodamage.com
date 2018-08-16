const fs = require('fs')
const TrinketRaw = require('../../src/assets/wow-data/TrinketRaw.json')

const TrinketSorted = TrinketRaw.sort((a, b) => a.name.localeCompare(b.name))
const Trinket = {}
for (const trinket of TrinketSorted) {
  const {name, itemId} = trinket
  if (!Trinket[name]) Trinket[name] = {itemId}
}

fs.writeFile('src/assets/wow-data/Trinket.json', JSON.stringify(Trinket), (err) => { if (err) console.err(err) })
