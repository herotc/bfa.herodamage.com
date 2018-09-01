const React = require('react')
const Layout = require('../../src/components/layout').default

// eslint-disable-next-line react/prop-types,react/display-name
module.exports = ({ element, props }) => {
  // eslint-disable-next-line react/prop-types
  const { location } = props
  return (
    <Layout location={location}>
      {element}
    </Layout>
  )
}
