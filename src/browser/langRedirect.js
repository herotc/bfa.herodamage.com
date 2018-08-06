import { navigateTo } from 'gatsby-link'

function langRedirect () {
  const lang = window.navigator.language.substring(0, 2)
  switch (lang) {
    case 'fr':
      navigateTo('/fr/')
      break
    default:
      navigateTo('/en/')
  }
}

export default langRedirect
