import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const checkBlockers = () => {
  setTimeout(() => {
    const ads = document.querySelectorAll('ins.adsbygoogle')
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

const initAd = () => {
  if (document.readyState === 'complete') {
    checkBlockers()
  } else {
    window.addEventListener('load', checkBlockers)
  }
  (window.adsbygoogle = window.adsbygoogle || []).push({})
}

const VerticalContainer = styled.div`
  margin: auto;
  padding: 0 8px;
  text-align: center;
`

class Ad extends React.Component {
  componentDidMount () {
    initAd()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // Do init the ad only if the location did changed
    if (this.props.location.key !== prevProps.location.key) {
      initAd()
    }
  }

  render () {
    const {location: {key}, type} = this.props
    const adKey = `${key}-${type}`
    const adId = `a-${type}-d`
    switch (type) {
      case 'top':
        return (
          <VerticalContainer key={adKey} id={adId}>
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="4519471734"
              data-ad-format="auto" data-full-width-responsive="true">
            </ins>
          </VerticalContainer>
        )
      case 'bot':
        return (
          <VerticalContainer key={adKey} id={adId}>
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="2851059041"
              data-ad-format="auto" data-full-width-responsive="true">
            </ins>
          </VerticalContainer>
        )
    }
  }
}

Ad.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

class DevAd extends React.Component {
  componentDidMount () {
    // console.log(`Mounted: ${this.props.type}`)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // Do init the ad only if the location did changed
    if (this.props.location.key !== prevProps.location.key) {
      // console.log(`Updated: ${this.props.type}`)
    }
  }

  render () {
    const {location: {key}, type} = this.props
    const adKey = `${key}-${type}`
    const adId = `a-${type}-d`
    switch (type) {
      case 'top':
      case 'bot':
        return (
          <VerticalContainer key={adKey} id={adId}>
          </VerticalContainer>
        )
    }
  }
}

DevAd.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

const GoogleAd = process.env.NODE_ENV === 'production' ? Ad : DevAd

export default GoogleAd
