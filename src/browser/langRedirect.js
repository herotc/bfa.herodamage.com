function langRedirect () {
  const lang = window.navigator.language.substring(0, 2)
  switch (lang) {
    case 'fr':
      window.location.href = '/fr/'
      break
    default:
      window.location.href = '/en/'
  }
}

export default langRedirect
