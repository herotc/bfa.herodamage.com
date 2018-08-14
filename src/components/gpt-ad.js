import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const REFRESH_TIMER = 60000

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

// TODO: Move into the class ?
let refreshIntervalConstructor
if (process.env.NODE_ENV === 'production') {
  refreshIntervalConstructor = (adSlot) => {
    return setInterval(
      function () { window.googletag.pubads().refresh([window.gptAdSlots[adSlot]]) },
      REFRESH_TIMER
    )
  }
} else {
  refreshIntervalConstructor = (adSlot) => {
    return setInterval(
      function () { console.log(`Refreshed: ${adSlot}`) },
      REFRESH_TIMER
    )
  }
}

class ProdAd extends React.Component {
  constructor (props) {
    super(props)

    const {type} = props
    switch (type) {
      case 'side':
        this.adId = 'div-gpt-ad-1534216735544-0'
        this.adSlot = 0
        break
    }
    this.containerId = `a-${type}-d`
    this.adRefreshIntervalId = null
  }

  componentDidMount () {
    window.googletag.cmd.push(function () { window.googletag.display(this.adId) })
    this.adRefreshIntervalId = refreshIntervalConstructor(this.adSlot)
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    if (this.props.location.key !== nextProps.location.key) {
      clearInterval(this.adRefreshIntervalId)
      window.googletag.pubads().refresh([window.gptAdSlots[this.adSlot]])
      this.adRefreshIntervalId = refreshIntervalConstructor(this.adSlot)
    }
    return false // we never update the component once mounted, refreshes are handled by GPT
  }

  render () {
    switch (this.props.type) {
      case 'side':
        return (
          <SideContainer id={this.containerId}>
            <div id={this.adId}>
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

class DevAd extends React.Component {
  constructor (props) {
    super(props)

    const {type} = props
    switch (type) {
      case 'side':
        this.adId = 'div-gpt-ad-1534216735544-0'
        this.adSlot = 0
        break
    }
    this.containerId = `a-${type}-d`
    this.adRefreshIntervalId = null
  }

  componentDidMount () {
    console.log(`Mounted: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
    this.adRefreshIntervalId = refreshIntervalConstructor(this.adSlot)
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    if (this.props.location.key !== nextProps.location.key) {
      console.log(`Updated: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
      clearInterval(this.adRefreshIntervalId)
      console.log(`Refreshed: ${this.adSlot}`)
      this.adRefreshIntervalId = refreshIntervalConstructor(this.adSlot)
    }
    return false // we never update the component once mounted, refreshes are handled by GPT
  }

  render () {
    switch (this.props.type) {
      case 'side':
        return (
          <SideContainer id={this.containerId}>
            <div id={this.adId}>
            </div>
          </SideContainer>
        )
    }
  }
}

DevAd.propTypes = {
  location: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
}

const GPTAd = process.env.NODE_ENV === 'production' ? ProdAd : DevAd

export default GPTAd
