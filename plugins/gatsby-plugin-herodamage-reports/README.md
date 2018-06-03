# gatsby-plugin-herodamage-reports

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[bfa.herodamage.com](https://github.com/herotc/bfa.herodamage.com).
Programmatically generate reports pages from `src/reports/`.

## Prerequisites

```
npm install --save gatsby-source-filesystem
```

## How to use

Edit `gatsby-config.js`:
```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'reports',
        path: `${__dirname}/src/reports/`
      }
    },
    'gatsby-plugin-herodamage-reports'
  ]
}
```

Then implement as many templates corresponding to simulationType as needed in `src/templates/simulations/`.  
You also have to implement a `src/templates/wow-class.js` template which is used by the classes index pages.
