import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import startCase from 'lodash/startCase'

import { Link } from 'gatsby'

import { wowIcon } from '../../utils/wow/ui'

const iconSize = 'calc((100vh - 32px) / 12 / 1.4)'
const iconSizeHover = 'calc((100vh - 32px) / 12)'
const Sidebar = styled.aside`
  @media screen and (max-width: 1552px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 16px;

    a {
      margin: 8px 16px;
    }
  }
  @media screen and (min-width: 1552px) {
    position: fixed;
    left: 16px;
    top: 50%;
    transform: translate(0, -50%);
    width: ${iconSizeHover};

    a {
      margin: 0 auto 0 0;
      transition: ${({ theme }) => theme.custom.css.transitionNormal};

      &:hover {
        width: ${iconSizeHover};
      }
    }
  }
  a {
    display: block;
    height: ${iconSizeHover};
    position: relative;
    width: ${iconSize};

    img {
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }
  }
`

const WowClassSelector = ({ i18nPlugin: { tLink }, siteMetadata: { wowClasses } }) => (
  <Sidebar>
    {wowClasses.map((wowClass) => (
      <Link key={wowClass} to={tLink(`/${wowClass}/`)}>
        <img src={wowIcon(wowClass)} alt={startCase(wowClass)}/>
      </Link>
    ))}
  </Sidebar>
)

WowClassSelector.propTypes = {
  i18nPlugin: PropTypes.object,
  siteMetadata: PropTypes.object.isRequired
}

export default WowClassSelector
