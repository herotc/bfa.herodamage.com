# gatsby-plugin-herodamage-posts

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[bfa.herodamage.com](https://github.com/herotc/bfa.herodamage.com).
Programmatically generate blog posts pages from `src/posts/`.

## Prerequisites

```
npm install --save gatsby-source-filesystem gatsby-transformer-remark
```

Then add an entry for `gatsby-transformer-remark` in `gatsby-config.js`:
```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: []
      }
    }
  ]
}
```

## How to use

Edit `gatsby-config.js`:
```javascript
module.exports = {
  plugins: [
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
```

Then implement the `src/templates/blog-posts.js` template file.  
You can also implements a `src/pages/blog.js` page to list the posts with a pagination.
