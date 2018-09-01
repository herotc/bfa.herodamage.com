import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Paper from '@material-ui/core/Paper'

const StyledPaper = styled(Paper)`
  && {
    background: ${({ theme }) => theme.custom.color.background.layout};
    margin: 16px 0;
    padding: 16px 24px;
  }
`

const Main = ({ children, ...props }) => {
  // 1) key is used to re-render the main on page change
  // 2) cloneElement is used to pass the props to children (which then does props drilling and force re-render)
  // both things can be seen as anti-pattern on React, solutions:
  // 1) refactor the children components to not rely on the fact they are mounted/unmounted to change some parts
  // 2) refactor the children to make usage of the context and thus having the layout updating it
  return (
    <main>
      <StyledPaper key={props.location.key} elevation={1}>
        {React.cloneElement(children, props)}
      </StyledPaper>
    </main>
  )
}

Main.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object.isRequired
}

export default Main
