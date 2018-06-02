import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

const HeaderElement = styled.div`
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

const Header = ({siteTitle}) => (
  <HeaderElement>
    <Container>
      <Title>
        <SiteLink to="/">
          {siteTitle}
        </SiteLink>
      </Title>
    </Container>
  </HeaderElement>
)

export default Header
