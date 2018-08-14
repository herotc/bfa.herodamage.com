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
  }

  componentDidMount () {
    window.googletag.cmd.push(function () { window.googletag.display(this.adId) })
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    // Once there is a page change, we ask to GPT to refresh the ads
    if (this.props.location.key !== nextProps.location.key) {
      window.googletag.pubads().refresh([window.gptAdSlots[this.adSlot]])
    }
    // We never update the component once mounted
    return false
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
  }

  componentDidMount () {
    console.log(`Mounted: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
  }

  shouldComponentUpdate (nextProps, nextStates, nextContext) {
    // Once there is a page change, we ask to GPT to refresh the ads
    if (this.props.location.key !== nextProps.location.key) {
      console.log(`Updated: ${this.props.type} | ${this.adSlot} | ${this.adId}`)
    }
    // We never update the component once mounted
    return false
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
