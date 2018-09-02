/**
 * Generate a random className, it's length is between minLength and minLength * 2.
 * @param minLength
 * @returns {string}
 */
export function generateRandomClassName (minLength = 10) {
  let randomClassName = ''
  for (let i = 0; i < minLength + Math.floor(Math.random() * (minLength + 1)); i++) {
    randomClassName += String.fromCharCode(97 + Math.floor(Math.random() * 26))
  }
  return randomClassName
}
