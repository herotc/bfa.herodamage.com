import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'gatsby-link'
import { langs } from '../../plugins/gatsby-plugin-herodamage-i18n'
import logo from '../assets/images/logo.svg'

const HeaderElement = styled.header`
  background: #303030;
  padding-bottom: 1.45rem;
`

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`

const Title = styled.h1`
  margin: 0;
`

const SiteLink = styled(Link)`
  align-items: center;
  color: white;
  display: flex;
  text-decoration: none;
  
  span {
    color: white;
    font-weight: bold;

    &:nth-of-type(2) {
      color: #b71c1c;
    }
  }
`

const LangSelector = ({className, lang, onClick}) => (
  <a className={className} onClick={onClick}>{lang}</a>
)
LangSelector.propTypes = {
  className: PropTypes.string,
  lang: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool
}
const StyledLangSelector = styled(LangSelector)`
  color: white;
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
  text-decoration: ${props => props.selected ? 'underline' : 'none'};
`

const Header = ({lang, onLangClick, siteTitle}) => (
  <HeaderElement>
    <Container>
      <Title>
        <SiteLink to={`/${lang}/`}>
          <img src={logo} style={{height: '3rem', width: '3rem'}}/>
          {siteTitle.split(' ').map((titlePart, index) => (<span key={index}>{titlePart}&nbsp;</span>))}
        </SiteLink>
      </Title>
      <div>
        {langs.map((langKey) =>
          <StyledLangSelector key={langKey} lang={langKey} onClick={(e) => onLangClick(`${langKey}`)}
            selected={lang === `${langKey}`}/>
        )}
      </div>
    </Container>
  </HeaderElement>
)

Header.propTypes = {
  lang: PropTypes.string,
  onLangClick: PropTypes.func,
  siteTitle: PropTypes.string
}

export default Header
