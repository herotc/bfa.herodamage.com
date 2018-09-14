import React from 'react'
import PropTypes from 'prop-types'

export default class HTML extends React.Component {
  render () {
    let googlePublisherTag, cookieconsent
    if (process.env.NODE_ENV === 'production') {
      googlePublisherTag = <script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'/>
      cookieconsent = (
        <>
          <link type="text/css" rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.4/cookieconsent.min.css"/>
          <script async src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"/>
        </>
      )
    }
    const { body, bodyAttributes, headComponents, htmlAttributes, postBodyComponents, preBodyComponents } = this.props
    return (
      <html {...htmlAttributes}>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          {headComponents}
          {googlePublisherTag}
        </head>
        <body {...bodyAttributes}>
          {preBodyComponents}
          <div key={'body'} id="___gatsby" dangerouslySetInnerHTML={{ __html: body }}/>
          {postBodyComponents}
          {cookieconsent}
          <script src="https://wow.zamimg.com/widgets/power.js"/>
        </body>
      </html>
    )
  }
}

HTML.propTypes = {
  body: PropTypes.string,
  bodyAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  htmlAttributes: PropTypes.object,
  postBodyComponents: PropTypes.array,
  preBodyComponents: PropTypes.array
}
