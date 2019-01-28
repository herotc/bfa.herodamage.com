import { ReportTransformer } from './transformer'

export const onCreateNode = async ({ node, actions }) => {
  const { deleteNode } = actions

  // Prevents non reports files to be processed
  if (node.sourceInstanceName !== 'reports') return
  // Prevents directories to be processed
  if (node.internal.type !== 'File') return
  // Delete unwanted node from reports (things like .DS_Store)
  if (node.extension !== 'json') {
    deleteNode({ node })
    return
  }

  const report = new ReportTransformer(node, actions)
  await report.generateReportNode()
}

export const createPages = async (api) => {
  await ReportTransformer.createPages(api)
}
