// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const adIds = []

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

class Ad extends React.Component {
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
    adIds.push(this.adId)

    this.initAd = this.initAd.bind(this)
  }

  /**
   * Add a message in case the ads are blocked
   */
  static blockersCheck () {
    for (let adId of adIds) {
      // Skip side one if viewport width < 1552 since we won't render anything inside anyway
      if (adId === 'a-1534304579228-0-d' && window.innerWidth < 1552) continue
      const ad = document.getElementById(adId)
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
  }

  /**
   * Start the timer before checking for blockers
   */
  static scheduleBlockersCheck () {
    const hdInitTime = window.herodamage.hasInitialized
    if (hdInitTime && Date.now() - hdInitTime > 500) {
      if (Ad.adsReady()) {
        setTimeout(Ad.blockersCheck, 500)
      } else {
        setTimeout(Ad.scheduleBlockersCheck, 50)
      }
    } else {
      setTimeout(Ad.scheduleBlockersCheck, 50)
    }
  }

  /**
   * Check if the services are enabled
   * @returns {{}|*}
   */
  static adsReady () {
    return window.gptAdSlots && window.googletag?.apiReady
  }

  /**
   * Init the ad and then refresh it (since initial load is disabled)
   */
  initAd () {
    if (Ad.adsReady()) {
      window.googletag.display(this.adId)
      window.googletag.pubads().refresh([window.gptAdSlots[this.adSlot]])
    } else {
      setTimeout(this.initAd, 20)
    }
  }

  componentDidMount () {
    if (window.document.readyState === 'complete') {
      Ad.scheduleBlockersCheck()
    } else {
      window.addEventListener('load', Ad.scheduleBlockersCheck)
    }
    this.initAd()
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    // Once there is a page change, we ask to GPT to refresh the ads
    if (this.props.location.key !== nextProps.location.key && Ad.adsReady()) {
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
            <div id={this.adId}>
            </div>
          </VerticalContainer>
        )
      case 'side':
        return (
          <SideContainer>
            <div id={this.adId}>
            </div>
          </SideContainer>
        )
    }
  }
}

Ad.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

class DevAd extends Ad {
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

const GPTAd = process.env.NODE_ENV === 'production' ? Ad : DevAd

export default GPTAd
