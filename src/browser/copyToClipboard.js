export function copyToClipboard (elementId) {
  const copyText = document.getElementById(elementId)
  copyText.select()
  document.execCommand('Copy')
}
