import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <ul>
      <li><Link to="/faq/">Go to faq</Link></li>
      <li><Link to="/blog/">Go to blog</Link></li>
      <li><Link to="/rogue/">Go to rogue</Link></li>
      <li><Link to="/404/">Go to 404</Link></li>
      <li><Link to="/error/">Go to dev error</Link></li>
    </ul>
  </div>
)

export default IndexPage
