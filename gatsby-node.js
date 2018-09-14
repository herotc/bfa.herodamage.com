export const onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({ name: '@babel/plugin-proposal-optional-chaining' })
}
