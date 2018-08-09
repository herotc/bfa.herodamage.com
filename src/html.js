import React from 'react'

let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`)
  } catch (e) {
    console.log(e)
  }
}

module.exports = class HTML extends React.Component {
  render () {
    let css, cookieconsentStyle, cookieconsentScript, cookieconsentLoad, adsenseScript
    if (process.env.NODE_ENV === `production`) {
      // Can't use React.Fragment yet, Gatsby V2 / Babel 7 only
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{__html: stylesStr}}
        />
      )
      cookieconsentStyle = (
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.4/cookieconsent.min.css"/>
      )
      cookieconsentScript = (
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"/>
      )
      cookieconsentLoad = (
        <script dangerouslySetInnerHTML={{__html: `
            window.addEventListener("load", function(){
              window.cookieconsent.initialise({
                "palette": {
                  "popup": {
                    "background": "#424242",
                    "text": "#ffffff"
                  },
                  "button": {
                    "background": "#b71c1c",
                    "text": "#ffffff"
                  }
                },
                "theme": "classic"
              })
            });
          `}}>
        </script>
      )
      adsenseScript = (
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"/>
      )
    }
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
          {css}
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{__html: this.props.body}}
          />
          {this.props.postBodyComponents}
          {cookieconsentStyle}
          {cookieconsentScript}
          {cookieconsentLoad}
          {adsenseScript}
        </body>
      </html>
    )
  }
}
