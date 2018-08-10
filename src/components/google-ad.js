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
  max-height: 90px;
  max-width: 728px;
  padding: 0 16px;
  text-align: center;
`

const SideContainer = styled.div`
  @media screen and (min-width: 1552px) {
    margin: 16px;
    max-height: calc(100vh - 32px);
    max-width: 300px;
    position: fixed;
    right: calc((100% - 1280px) / 4 - 16px);
    text-align: center;
    top: 50%;
    transform: translate(50%, -50%);
    width: calc((100% - 1280px) / 2 - 32px);
  }
  @media screen and (min-width: 1920px) {
    right: calc(100% / 12 - 16px);
    width: calc(100% / 6 - 32px);
  }
`

class Ad extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : undefined
    }

    this.getWidth = this.getWidth.bind(this)
    this.shouldPreventSideRendering = this.shouldPreventSideRendering.bind(this)
  }

  getWidth () {
    this.setState({innerWidth: window.innerWidth})
  }

  shouldPreventSideRendering () {
    // Prevent rendering for SSR and whenever the viewport width is lower than 1552
    const {innerWidth} = this.state
    return typeof window === 'undefined' || !innerWidth || innerWidth < 1552
  }

  componentDidMount () {
    if (this.props.type === 'side') {
      window.addEventListener('resize', this.getWidth)
      // Do init the side ad only if we actually rendered it
      if (!this.shouldPreventSideRendering()) {
        initAd()
      }
    } else {
      initAd()
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // Do init the ad only if the location did changed
    if (this.props.location.key !== prevProps.location.key) {
      if (this.props.type === 'side') {
        // Do init the side ad only if we actually rendered it
        if (!this.shouldPreventSideRendering()) {
          initAd()
        }
      } else {
        initAd()
      }
    }
  }

  componentWillUnmount () {
    if (this.props.type === 'side') {
      window.removeEventListener('resize', this.getWidth)
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
      case 'side':
        if (this.shouldPreventSideRendering()) return null
        return (
          <SideContainer key={adKey} id={adId}>
            <ins className="adsbygoogle" style={{display: 'block'}}
              data-ad-client="ca-pub-5677349133508739" data-ad-slot="6483290095"
              data-ad-format="auto" data-full-width-responsive="true">
            </ins>
          </SideContainer>
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
  constructor (props) {
    super(props)

    this.state = {
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : undefined
    }

    this.getWidth = this.getWidth.bind(this)
    this.shouldPreventSideRendering = this.shouldPreventSideRendering.bind(this)
  }

  getWidth () {
    this.setState({innerWidth: window.innerWidth})
  }

  shouldPreventSideRendering () {
    // Prevent rendering for SSR and whenever the viewport width is lower than 1552
    const {innerWidth} = this.state
    return typeof window === 'undefined' || !innerWidth || innerWidth < 1552
  }

  componentDidMount () {
    if (this.props.type === 'side') {
      // console.log(`EventListener Added: ${this.props.type}`)
      window.addEventListener('resize', this.getWidth)
      // Do init the side ad only if we actually rendered it
      if (!this.shouldPreventSideRendering()) {
        // console.log(`Mounted: ${this.props.type}`)
      }
    } else {
      // console.log(`Mounted: ${this.props.type}`)
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // Do init the ad only if the location did changed
    if (this.props.location.key !== prevProps.location.key) {
      if (this.props.type === 'side') {
        // Do init the side ad only if we actually rendered it
        if (!this.shouldPreventSideRendering()) {
          // console.log(`Updated: ${this.props.type}`)
        }
      } else {
        // console.log(`Updated: ${this.props.type}`)
      }
    }
  }

  componentWillUnmount () {
    if (this.props.type === 'side') {
      // console.log(`EventListener Removed: ${this.props.type}`)
      window.removeEventListener('resize', this.getWidth)
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
      case 'side':
        if (this.shouldPreventSideRendering()) return null
        return (
          <SideContainer key={adKey} id={adId}>
          </SideContainer>
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
