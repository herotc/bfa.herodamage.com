import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const VerticalContainer = styled.div`
  margin: auto;
  padding: 0 8px;
  text-align: center;
`

const SideContainer = styled.div`
  @media screen and (min-width: 1552px) {
    margin: 8px;
    max-height: calc(100vh - 16px);
    max-width: 300px;
    position: fixed;
    right: calc((100% - 1280px) / 4 - 8px);
    text-align: center;
    top: 50%;
    transform: translate(50%, -50%);
    width: calc((100% - 1280px) / 2 - 16px);
  }
  @media screen and (min-width: 1920px) {
    right: calc(100% / 12 - 8px);
    width: calc(100% / 6 - 16px);
  }
`

let randomClassName = ''
for (let i = 0; i < 14; i++) {
  randomClassName += String.fromCharCode(97 + Math.floor(Math.random() * 26))
}

/**
 * Add a message in case the ad fails to render
 */
function initBlockersCheck () {
  setTimeout(() => {
    const ads = document.querySelectorAll(`div.${randomClassName}`)
    for (let ad of ads) {
      if (ad && ad.innerHTML.replace(/\s/g, '').length === 0) {
        // Check if there isn't a message already
        const parent = ad.parentElement
        let messageAlreadyDisplayed = false
        for (let element of parent.children) {
          if (element.className === 'blockers-text') messageAlreadyDisplayed = true
        }
        // Insert the message
        if (!messageAlreadyDisplayed) {
          const blockersMessage = document.createElement('p')
          blockersMessage.className = 'blockers-text'
          blockersMessage.innerHTML = 'Hero Damage is made possible by displaying online advertisements.<br>Please consider supporting us by disabling your ad blocker.'
          parent.appendChild(blockersMessage)
        }
      }
    }
  }, 1500)
}

/**
 * Check if the services are enabled
 */
function adsReady () {
  return window.googletag && window.googletag.apiReady
}

/**
 * Init the ad and then refresh it (since initial load is disabled)
 * @param adId
 * @param adSlot
 */
function initAd (adId, adSlot) {
  if (adsReady()) {
    window.googletag.display(adId)
    window.googletag.pubads().refresh([window.gptAdSlots[adSlot]])
  } else {
    setTimeout(() => { initAd(adId, adSlot) }, 20)
  }
}

class ProdAd extends React.Component {
  constructor (props) {
    super(props)

    switch (props.type) {
      case 'top':
        this.adId = 'a-1534303848220-0-d'
        this.adSlot = 0
        break
      case 'side':
        this.adId = 'a-1534304579228-0-d'
        this.adSlot = 1
        break
      case 'bot':
        this.adId = 'a-1534304680941-0-d'
        this.adSlot = 2
        break
    }
    this.className = randomClassName
  }

  componentDidMount () {
    initBlockersCheck()
    initAd(this.adId, this.adSlot)
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    // Once there is a page change, we ask to GPT to refresh the ads
    if (this.props.location.key !== nextProps.location.key && adsReady()) {
      window.googletag.pubads().refresh([window.gptAdSlots[this.adSlot]])
    }
    // We never update the component once mounted
    return false
  }

  render () {
    switch (this.props.type) {
      case 'top':
      case 'bot':
        return (
          <VerticalContainer>
            <div id={this.adId} className={this.className}>
            </div>
          </VerticalContainer>
        )
      case 'side':
        return (
          <SideContainer>
            <div id={this.adId} className={this.className}>
            </div>
          </SideContainer>
        )
    }
  }
}

ProdAd.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

class DevAd extends ProdAd {
  componentDidMount () {
    // console.log(`Mounted: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    // Once there is a page change, we ask to GPT to refresh the ads
    if (this.props.location.key !== nextProps.location.key) {
      // console.log(`Updated: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
    }
    // We never update the component once mounted
    return false
  }
}

DevAd.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

const GPTAd = process.env.NODE_ENV === 'production' ? ProdAd : DevAd

export default GPTAd
