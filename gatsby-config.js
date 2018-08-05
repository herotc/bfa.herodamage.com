module.exports = {
  siteMetadata: {
    title: 'Hero Damage',
    url: 'https://bfa.herodamage.com',
    description: 'Class theorycrafting community, latest simulation results and resources -based on SimulationCraft- for World of Warcraft.',
    keywords: 'herotc, herodamage, world of warcraft, battle for azeroth, wow bfa, theorycrafting, simulationcraft, simc'
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
