import { writeFile } from 'fs'
import TrinketRaw from '../../src/assets/wow-data/raw/Trinket.json'

export function filterTrinket () {
  const TrinketSorted = TrinketRaw.sort((a, b) => a.name.localeCompare(b.name))
  const Trinkets = {}
  for (const trinket of TrinketSorted) {
    const { name, itemId } = trinket
    if (!Trinkets[name]) Trinkets[name] = { itemId }
  }

  writeFile('src/assets/wow-data/Trinket.json', JSON.stringify(Trinkets), (err) => { if (err) console.err(err) })
}
