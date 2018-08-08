import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { unmountComponentAtNode } from 'react-dom'

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
          if (ad.parentElement.classList.contains('a-matchedcontent-d')) {
            blockersMessage.innerHTML = 'This block suggests you recommended content from HeroTC using Google Adsense.<br>You might want to disable your ad blocker to see its content.'
          } else {
            blockersMessage.innerHTML = 'Hero Damage is made possible by displaying online advertisements.<br>Please consider supporting us by disabling your ad blocker.'
          }
          parent.appendChild(blockersMessage)
        }
      }
    }
  }, 3000)
}

const initAd = () => {
  if (document.readyState === 'complete') {
    checkBlockers()
  } else {
    window.addEventListener('load', checkBlockers)
  }
  (window.adsbygoogle = window.adsbygoogle || []).push({})
}

const AdaptiveContainer = styled.div`
  @media screen and (min-width: 1552px) {
    margin: 16px 8px;
    max-height: calc(100vh - 32px);
    max-width: 300px;
    position: fixed;
    ${({position}) => position}: calc((100% - 1280px) / 4 - 8px);
    top: 50%;
    transform: translate(${({position}) => position === 'left' ? '-50%' : '50%'}, -50%);
    width: calc((100% - 1280px) / 2 - 16px);
  }
  @media screen and (min-width: 1920px) {
    ${({position}) => position}: calc(100% / 12 - 8px);
    width: calc(100% / 6 - 16px);
  }
`

class Ad extends React.Component {
  componentDidMount () {
    initAd()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    initAd()
  }

  // We manually remove 'top', 'matchedcontent' and 'bot' ads to refresh them whenever they receives new location in props.
  // They are static (in the layout), so the only props update they can receive is a new location.
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {type} = nextProps
    switch (type) {
      case 'top':
      case 'matchedcontent':
      case 'bop':
        unmountComponentAtNode(document.getElementById(`a-${type}-d`))
    }
    return true
  }

  render () {
    const {location, type} = this.props
    const {key} = location
    const adId = `${key}-${type}`
    switch (type) {
      case 'top':
        return (
          <AdaptiveContainer key={adId} position="left" id="a-top-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="8259895565"
              data-ad-format="auto">
            </ins>
          </AdaptiveContainer>
        )
      case 'inarticle':
        return (
          <div key={adId} id="a-inarticle-d">
            <ins className="adsbygoogle" style={{display: 'block', textAlign: 'center'}}
              data-ad-layout="in-article" data-ad-format="fluid"
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="9316992214">
            </ins>
          </div>
        )
      case 'infeed':
        return (
          <div key={adId} id="a-infeed-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-format="fluid" data-ad-layout-key="-gc-3-1f-cz+zv"
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="7987598673">
            </ins>
          </div>
        )
      case 'matchedcontent':
        return (
          <div key={adId} id="a-matchedcontent-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="3956909192"
              data-matched-content-ui-type="text,text" data-matched-content-rows-num="1,1"
              data-matched-content-columns-num="1,2" data-ad-format="autorelaxed">
            </ins>
          </div>
        )
      case 'bot':
        return (
          <AdaptiveContainer key={adId} position="right" id="a-bot-d">
            <ins key={adId} className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="8934153725"
              data-ad-format="auto">
            </ins>
          </AdaptiveContainer>
        )
    }
  }
}

Ad.propTypes = {
  location: PropTypes.object,
  type: PropTypes.string
}

class DevAd extends React.Component {
  render () {
    const {location, type} = this.props
    const {key} = location
    const adId = `${key}-${type}`
    switch (type) {
      case 'top':
      case 'bot':
        return (
          <AdaptiveContainer key={adId} id={`a-${type}-d`} position={type === 'top' ? 'left' : 'right'}>
          </AdaptiveContainer>
        )
      case 'inarticle':
      case 'infeed':
      case 'matchedcontent':
        return (
          <div key={adId} id={`a-${type}-d`}>
          </div>
        )
    }
  }
}

DevAd.propTypes = {
  location: PropTypes.object,
  type: PropTypes.string
}

const GoogleAd = process.env.NODE_ENV === 'production' ? Ad : DevAd

export default GoogleAd
