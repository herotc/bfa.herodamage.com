module.exports = {
  siteMetadata: {
    title: 'Hero Damage'
  },
  plugins: [
    'gatsby-plugin-react-next',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-herodamage-material-ui',
    'gatsby-plugin-herodamage-i18n',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: []
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'reports',
        path: `${__dirname}/static/reports/`
      }
    },
    'gatsby-plugin-herodamage-reports',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/src/posts/`
      }
    },
    'gatsby-plugin-herodamage-posts'
  ]
}
