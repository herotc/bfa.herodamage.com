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
    let analytics, css, cookieconsent, adsense
    if (process.env.NODE_ENV === `production`) {
      analytics = (
        <>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-109496873-1"/>
          <script dangerouslySetInnerHTML={{__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'UA-109496873-1');
            `}}/>
        </>
      )
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{__html: stylesStr}}
        />
      )
      cookieconsent = (
        <>
          <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.4/cookieconsent.min.css"/>
          <script async src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js"/>
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
          `}}/>
        </>
      )
      adsense = (
        <>
          <script dangerouslySetInnerHTML={{__html: `
            window.addEventListener("load", function () {
              setTimeout(function() {
                var ads = document.querySelectorAll("ins.adsbygoogle");
                for (var i = 0; i < ads.length; i++) {
                  var ad = ads[i];
                  if (ad && ad.innerHTML.replace(/\\s/g, "").length == 0) {
                    var blockersMessage = document.createElement('p');
                    blockersMessage.className = 'blockers-text';
                    if (ad.parentElement.classList.contains("a-matchedcontent-d")) {
                      blockersMessage.innerHTML = 'This block suggests you recommended content from HeroTC using Google Adsense.<br>You might want to disable your ad blocker to see its content.';
                    } else {
                      blockersMessage.innerHTML = 'Hero Damage is made possible by displaying online advertisements.<br>Please consider supporting us by disabling your ad blocker.';
                    }
                    ad.parentElement.appendChild(blockersMessage);
                  }
                }
              }, 1500);
            });
          `}}/>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"/>
          <script dangerouslySetInnerHTML={{__html: '(window.adsbygoogle = window.adsbygoogle || []).push({});'}}/>
        </>
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
          {analytics}
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
          {cookieconsent}
          {adsense}
        </body>
      </html>
    )
  }
}
