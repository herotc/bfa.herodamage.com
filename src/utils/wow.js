import startCase from 'lodash/startCase'

export function getSpecVariation (t, spec, variation, formatted = true) {
  if (formatted) {
    return `${startCase(t(spec))}${variation !== '' ? ` ${startCase(t(variation))}` : ''}`
  } else {
    return `${t(spec)}${variation !== '' ? ` ${t(variation)}` : ''}`
  }
}
