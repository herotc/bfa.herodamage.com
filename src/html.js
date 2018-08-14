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
    let css, cookieconsentStyle, cookieconsentScript, cookieconsentLoad, adsenseScript, gptScript, gptLoad, gptInit
    if (process.env.NODE_ENV === `production`) {
      // Can't use React.Fragment yet, Gatsby V2 / Babel 7 only
      css = (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{__html: stylesStr}}
        />
      )
      gptScript = (
        <script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'>
        </script>
      )
      gptLoad = (
        <script dangerouslySetInnerHTML={{__html: `
            var googletag = googletag || {};
            googletag.cmd = googletag.cmd || [];
          `}}>
        </script>
      )
      gptInit = (
        <script dangerouslySetInnerHTML={{__html: `
            var gptAdSlots = [];
            googletag.cmd.push(function() {
              var mapping = googletag.sizeMapping()
                .addSize([0, 0], [])
                .addSize([1552, 256], [120, 240])
                .addSize([1552, 616], [[120, 600], [120, 240]])
                .addSize([1562, 141], [125, 125])
                .addSize([1562, 256], [[120, 240], [125, 125]])
                .addSize([1562, 616], [[120, 600], [120, 240], [125, 125]])
                .addSize([1632, 141], [125, 125])
                .addSize([1632, 256], [[120, 240], [125, 125]])
                .addSize([1632, 616], [[160, 600], [120, 600], [120, 240], [125, 125]])
                .addSize([1712, 141], [125, 125])
                .addSize([1712, 216], [[200, 200], [125, 125]])
                .addSize([1712, 256], [[200, 200], [120, 240], [125, 125]])
                .addSize([1712, 616], [[160, 600], [120, 600], [200, 200], [120, 240], [125, 125]])
                .addSize([1812, 141], [125, 125])
                .addSize([1812, 216], [[200, 200], [125, 125]])
                .addSize([1812, 256], [[200, 200], [120, 240], [125, 125]])
                .addSize([1812, 266], [[250, 250], [200, 200], [120, 240], [125, 125]])
                .addSize([1812, 616], [[160, 600], [120, 600], [250, 250], [200, 200], [120, 240], [125, 125]])
                .addSize([1912, 141], [125, 125])
                .addSize([1912, 216], [[200, 200], [125, 125]])
                .addSize([1912, 256], [[200, 200], [120, 240], [125, 125]])
                .addSize([1912, 266], [[300, 250], [250, 250], [200, 200], [120, 240], [125, 125]])
                .addSize([1912, 616], [[300, 600], [160, 600], [120, 600], [300, 250], [250, 250], [200, 200], [120, 240], [125, 125]])
                .addSize([1912, 1066], [[300, 1050], [300, 600], [160, 600], [120, 600], [300, 250], [250, 250], [200, 200], [120, 240], [125, 125]])
                .build();

              gptAdSlots[0] = googletag
                .defineSlot('/21735668613/bfa-hd_ch1_tall', [120, 600], 'div-gpt-ad-1534216735544-0')
                .defineSizeMapping(mapping)
                .addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.pubads().collapseEmptyDivs();
              googletag.enableServices();
            });
          `}}>
        </script>
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
          {gptScript}
          {gptLoad}
          {gptInit}
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
          <script dangerouslySetInnerHTML={{__html: `
              var whTooltips = {colorLinks: true, iconizeLinks: true, iconSize: true};
            `}}>
          </script>
          <script src="https://wow.zamimg.com/widgets/power.js">
          </script>
        </body>
      </html>
    )
  }
}
