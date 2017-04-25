export const sortingTool = (a, b) => {
  if (a.metaOrder && b.metaOrder === undefined) {
    return -1
  } else if (a.metaOrder === undefined && b.metaOrder) {
    return 1
  } else if (a.metaOrder && b.metaOrder) {
    return a.metaOrder - b.metaOrder
  }
  return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
}
