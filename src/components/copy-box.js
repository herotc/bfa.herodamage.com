// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// Components
import { copyToClipboard } from '../browser/copyToClipboard'

import Button from '@material-ui/core/Button'

const Container = styled.div`
  > h3 {
    margin-bottom: 0;
  }

  > p {
    align-items: stretch;
    display: flex;
    margin-top: 0;

    > textarea {
      background-color: ${({ theme }) => theme.palette.primary.light};
      border: none;
      color: ${({ theme }) => theme.palette.common.white};
      padding: 8px;
      resize: vertical;
      width: 100%;
    }
    
    > button {
      background-color: ${({ theme }) => theme.palette.primary.light};
      border-radius: 0;
    }
  }
`

const CopyBox = ({ elementId, text, title, ...props }) => (
  <Container {...props}>
    <h3>{title}</h3>
    <p>
      <textarea id={elementId} rows="1" defaultValue={text} readOnly/>
      <Button onClick={() => { copyToClipboard(elementId) }}>Copy</Button>
    </p>
  </Container>
)

CopyBox.propTypes = {
  elementId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default CopyBox
