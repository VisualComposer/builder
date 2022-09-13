interface SortItem {
  thirdParty: boolean,
  metaOrder: number,
  name: {
    localeCompare: (text:string, locale:{kn:boolean}, options:{sensitivity:string}) => number
  }
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
  return a.name ? a.name.localeCompare(b.name.toString(), { kn: true }, { sensitivity: 'base' }) : -1
}
