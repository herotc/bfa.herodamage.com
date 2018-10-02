// Dependencies
import React from 'react'
import PropTypes from 'prop-types'
import { siteMetadata } from '../gatsby-config'
// Assets
import appleTouchIcon from './assets/images/favicon/apple-touch-icon.png'
import favicon16x16 from './assets/images/favicon/favicon-16x16.png'
import favicon32x32 from './assets/images/favicon/favicon-32x32.png'
import safariPinnedTab from './assets/images/favicon/safari-pinned-tab.svg'

export default class HTML extends React.Component {
  render () {
    let googlePublisherTag, cookieconsent
    if (process.env.NODE_ENV === 'production') {
      googlePublisherTag = <script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'/>
      cookieconsent = (<>
        <link type="text/css" rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.4/cookieconsent.min.css"/>
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"/>
      </>)
    }
    const { body, bodyAttributes, headComponents, htmlAttributes, postBodyComponents, preBodyComponents } = this.props
    return (
      <html {...htmlAttributes}>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <title>{siteMetadata.title}</title>
          <meta name="description" content={siteMetadata.description}/>
          <meta name="keywords" content={siteMetadata.keywords}/>
          <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon}/>
          <link rel="icon" type="image/png" sizes="32x32" href={favicon32x32}/>
          <link rel="icon" type="image/png" sizes="16x16" href={favicon16x16}/>
          <link rel="manifest" href="/site.webmanifest"/>
          <link rel="mask-icon" href={safariPinnedTab} color="#b71c1c"/>
          <meta name="msapplication-TileColor" content="#212121"/>
          <meta name="theme-color" content="#ffffff"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
          {headComponents}
          {googlePublisherTag}
        </head>
        <body {...bodyAttributes}>
          {preBodyComponents}
          <div key={'body'} id="___gatsby" dangerouslySetInnerHTML={{ __html: body }}/>
          {postBodyComponents}
          {cookieconsent}
          <script
            dangerouslySetInnerHTML={{ __html: `var whTooltips = {colorLinks: true, iconizeLinks: true, iconSize: true, renameLinks: true};` }}/>
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
