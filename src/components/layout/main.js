import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'

const StyledPaper = styled(Paper)`
  background: ${({theme}) => theme.custom.color.background.layout};
  margin: 16px 0;
  padding: 16px 24px;
`

const Main = ({children, ...props}) => {
  return (
    <main>
      <StyledPaper elevation={1}>
        {React.cloneElement(children, props)}
      </StyledPaper>
    </main>
  )
}

Main.propTypes = {
  children: PropTypes.node
}

export default Main
