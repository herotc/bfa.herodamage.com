import React from 'react'

const WowClassTemplate = ({data}) => {
  console.log(data)
  return (
    <div>
      <h1>Wow Class Index</h1>
    </div>
  )
}

export default WowClassTemplate

export const query = graphql`
  query WowClassIndex($lang: String!, $wowClass: String!) {
    allSitePage(filter: {context: {lang: {eq: $lang}, wowClass: {eq: $wowClass}, simulationType: {ne: null}}}) {
      edges {
        node {
          id
          path
          context {
            slug
            name
            wowClass
            simulationType
            fightStyle
            tier
            spec
            variation
            targetError
            resultTime
            version
            build
            buildTime
            gitRevision
          }
        }
      }
    }
  }
`
