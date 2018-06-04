import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'gatsby-link'

const HeaderElement = styled.header`
  background: rebeccapurple;
  margin-bottom: 1.45rem;
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`

const Title = styled.h1`
  margin: 0;
`

const SiteLink = styled(Link)`
  color: white;
  text-decoration: none;
`

const LangSelector = ({lang, onClick}) => (
  <a onClick={onClick}>{lang}</a>
)
LangSelector.propTypes = {
  lang: PropTypes.string,
  onClick: PropTypes.func,
  selected: PropTypes.bool
}
const StyledLangSelector = styled(LangSelector)`
  color: yellow;
  margin-right: 10px;
  text-decoration: ${props => props.selected ? 'underline' : 'none'};
  cursor: pointer;
`

const Header = ({lang, onLangClick, siteTitle}) => (
  <HeaderElement>
    <Container>
      <Title>
        <SiteLink to={`/${lang}/`}>
          {siteTitle}
        </SiteLink>
      </Title>
      <div>
        <StyledLangSelector lang='en' onClick={(e) => onLangClick('en')} selected={lang === 'en'}/>
        <StyledLangSelector lang='fr' onClick={(e) => onLangClick('fr')} selected={lang === 'fr'}/>
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
