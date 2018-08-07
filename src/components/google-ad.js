import React from 'react'
import PropTypes from 'prop-types'
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
  }, 5000)
}

class Ad extends React.Component {
  componentDidMount () {
    // Disabled for now
    // if (document.readyState === 'complete') {
    //   checkBlockers()
    // } else {
    //   window.addEventListener('load', checkBlockers)
    // }
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }

  // We manually remove top and bot ads to refresh them whenever they receives new location in props
  shouldComponentUpdate (nextProps, nextState, nextContext) {
    const {type} = nextProps
    switch (type) {
      case 'top':
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
          <div key={adId} id="a-top-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="8259895565"
              data-ad-format="auto">
            </ins>
          </div>
        )
      case 'inarticle':
        return (
          <p key={adId} className="a-inarticle-d">
            <ins className="adsbygoogle" style={{display: 'block', textAlign: 'center'}}
              data-ad-layout="in-article" data-ad-format="fluid"
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="9316992214">
            </ins>
          </p>
        )
      case 'infeed':
        return (
          <div key={adId} className="a-infeed-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-format="fluid" data-ad-layout-key="-gc-3-1f-cz+zv"
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="7987598673">
            </ins>
          </div>
        )
      case 'matchedcontent':
        return (
          <p key={adId} className="a-matchedcontent-d">
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="3956909192"
              data-matched-content-ui-type="image_stacked" data-matched-content-rows-num="2,1"
              data-matched-content-columns-num="1,4" data-ad-format="autorelaxed">
            </ins>
          </p>
        )
      case 'bot':
        return (
          <div key={adId} id="a-bot-d">
            <ins key={adId} className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="8934153725"
              data-ad-format="auto">
            </ins>
          </div>
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
      case 'infeed':
      case 'bot':
        return (
          <div key={adId} id={`a-${type}-d`}>
          </div>
        )
      case 'inarticle':
      case 'matchedcontent':
        return (
          <p key={adId} className={`a-${type}-d`}>
          </p>
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
