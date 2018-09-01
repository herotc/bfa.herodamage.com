const fs = require('fs')
const TrinketRaw = require('../../src/assets/wow-data/raw/Trinket.json')

const TrinketSorted = TrinketRaw.sort((a, b) => a.name.localeCompare(b.name))
const Trinkets = {}
for (const trinket of TrinketSorted) {
  const { name, itemId } = trinket
  if (!Trinkets[name]) Trinkets[name] = { itemId }
}

fs.writeFile('src/assets/wow-data/Trinket.json', JSON.stringify(Trinkets), (err) => { if (err) console.err(err) })
