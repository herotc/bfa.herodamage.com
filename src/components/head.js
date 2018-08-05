import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import appleTouchIcon57x57 from '../assets/images/favicon/apple-touch-icon-57x57.png'
import appleTouchIcon60x60 from '../assets/images/favicon/apple-touch-icon-60x60.png'
import appleTouchIcon72x72 from '../assets/images/favicon/apple-touch-icon-72x72.png'
import appleTouchIcon76x76 from '../assets/images/favicon/apple-touch-icon-76x76.png'
import appleTouchIcon114x114 from '../assets/images/favicon/apple-touch-icon-114x114.png'
import appleTouchIcon120x120 from '../assets/images/favicon/apple-touch-icon-120x120.png'
import appleTouchIcon144x144 from '../assets/images/favicon/apple-touch-icon-144x144.png'
import appleTouchIcon152x152 from '../assets/images/favicon/apple-touch-icon-152x152.png'
import favicon16x16 from '../assets/images/favicon/favicon-16x16.png'
import favicon32x32 from '../assets/images/favicon/favicon-32x32.png'
import favicon96x96 from '../assets/images/favicon/favicon-96x96.png'
import favicon128 from '../assets/images/favicon/favicon-128.png'
import favicon196x196 from '../assets/images/favicon/favicon-196x196.png'
import favicon from '../assets/images/favicon/favicon.ico'
import mstile70x70 from '../assets/images/favicon/mstile-70x70.png'
import mstile144x144 from '../assets/images/favicon/mstile-144x144.png'
import mstile150x150 from '../assets/images/favicon/mstile-150x150.png'
import mstile310x150 from '../assets/images/favicon/mstile-310x150.png'
import mstile310x310 from '../assets/images/favicon/mstile-310x310.png'

const Head = ({siteMetadata}) => (
  <Helmet>
    <title>{siteMetadata.title}</title>
    <meta name="description" content={siteMetadata.description}/>
    <meta name="keywords" content={siteMetadata.keywords}/>
    <link rel="apple-touch-icon-precomposed" sizes="57x57" href={appleTouchIcon57x57}/>
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href={appleTouchIcon114x114}/>
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href={appleTouchIcon72x72}/>
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href={appleTouchIcon144x144}/>
    <link rel="apple-touch-icon-precomposed" sizes="60x60" href={appleTouchIcon60x60}/>
    <link rel="apple-touch-icon-precomposed" sizes="120x120" href={appleTouchIcon120x120}/>
    <link rel="apple-touch-icon-precomposed" sizes="76x76" href={appleTouchIcon76x76}/>
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href={appleTouchIcon152x152}/>
    <link rel="icon" type="image/png" href={favicon196x196} sizes="196x196"/>
    <link rel="icon" type="image/png" href={favicon128} sizes="128x128"/>
    <link rel="icon" type="image/png" href={favicon96x96} sizes="96x96"/>
    <link rel="icon" type="image/png" href={favicon32x32} sizes="32x32"/>
    <link rel="icon" type="image/png" href={favicon16x16} sizes="16x16"/>
    <link rel="icon" type="image/x-icon" href={favicon}/>
    <meta name="application-name" content="Hero Damage"/>
    <meta name="msapplication-TileColor" content="#303030"/>
    <meta name="msapplication-TileImage" content={mstile144x144}/>
    <meta name="msapplication-square70x70logo" content={mstile70x70}/>
    <meta name="msapplication-square150x150logo" content={mstile150x150}/>
    <meta name="msapplication-wide310x150logo" content={mstile310x150}/>
    <meta name="msapplication-square310x310logo" content={mstile310x310}/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
  </Helmet>
)

Head.propTypes = {
  siteMetadata: PropTypes.object
}

export default Head
