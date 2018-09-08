// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// Assets
import amber from '@material-ui/core/colors/amber'
import WarningIcon from '@material-ui/icons/Warning'

const variants = {
  warning: { Icon: WarningIcon, background: amber[700] }
}

const Container = styled.p`
  align-items: center;
  background-color: ${({ variant }) => variants[variant].background};
  color: ${({ theme }) => theme.palette.common.white};
  display: flex;
  justify-content: center;
  padding: 8px 0;
  
  > * {
    margin: 0 8px;
  }
`

const TextBox = ({ text, variant, ...props }) => {
  const { Icon } = variants[variant]
  return (
    <Container {...props} variant={variant}>
      <Icon/>
      {text}
    </Container>
  )
}

TextBox.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
}

export default TextBox
