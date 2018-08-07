import React from 'react'
import PropTypes from 'prop-types'

const GoogleAd = ({type}) => {
  switch (type) {
    case 'top':
      return (
        <div id="a-top-d">
          <ins className="adsbygoogle" style="display:block;"
            data-ad-client="ca-pub-5677349133508739" data-ad-slot="8259895565"
            data-ad-format="auto"/>
        </div>
      )
    case 'inarticle':
      return (
        <p className="a-inarticle-d">
          <ins className="adsbygoogle" style="display:block; text-align:center;"
            data-ad-layout="in-article" data-ad-format="fluid"
            data-ad-client="ca-pub-5677349133508739" data-ad-slot="9316992214"/>
        </p>
      )
    case 'infeed':
      return (
        <div className="a-infeed-d">
          <ins className="adsbygoogle" style="display:block;"
            data-ad-format="fluid" data-ad-layout-key="-gc-3-1f-cz+zv"
            data-ad-client="ca-pub-5677349133508739" data-ad-slot="7987598673"/>
        </div>
      )
    case 'matchedcontent':
      return (
        <p className="a-matchedcontent-d">
          <ins className="adsbygoogle" style="display:block"
            data-ad-client="ca-pub-5677349133508739" data-ad-slot="3956909192"
            data-matched-content-ui-type="image_stacked" data-matched-content-rows-num="2,1"
            data-matched-content-columns-num="1,4" data-ad-format="autorelaxed"/>
        </p>
      )
    case 'bot':
      return (
        <div id="a-bot-d">
          <ins className="adsbygoogle" style="display:block;"
            data-ad-client="ca-pub-5677349133508739" data-ad-slot="8934153725"
            data-ad-format="auto"/>
        </div>
      )
  }
}

GoogleAd.propTypes = {
  type: PropTypes.string
}

export default GoogleAd
