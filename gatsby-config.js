module.exports = {
  siteMetadata: {
    title: 'Hero Damage'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `reports`,
        path: `${__dirname}/src/reports/`
      }
    },
    'gatsby-plugin-herodamage-reports'
  ]
}
