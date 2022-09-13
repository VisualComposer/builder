interface SortItem {
  thirdParty: boolean,
  metaOrder: number,
  name: string
}

export const sortingTool = (a:SortItem, b:SortItem) => {
  if (a.thirdParty) {
    return 1
  } else if (b.thirdParty) {
    return -1
  } else if (a.metaOrder && b.metaOrder === undefined) {
    return -1
  } else if (a.metaOrder === undefined && b.metaOrder) {
    return 1
  } else if (a.metaOrder && b.metaOrder) {
    return a.metaOrder - b.metaOrder
  }

  // @ts-ignore locales argument can be string, array or object
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#parameters
  return a.name ? a.name.localeCompare(b.name, { kn: true }, { sensitivity: 'base' }) : -1
}
