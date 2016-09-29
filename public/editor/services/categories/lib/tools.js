import _ from 'lodash'

export const sortingTool = (a, b) => {
  if (a.metaOrder && b.metaOrder === undefined) {
    return -1
  } else if (a.metaOrder === undefined && b.metaOrder) {
    return 1
  } else if (a.metaOrder && b.metaOrder) {
    return a.metaOrder - b.metaOrder
  }
  return a.name.localeCompare(b.name, {kn: true}, {sensitivity: 'base'})
}
export const getCategoriesList = (filter, data) => {
  let dataList = filter === true ? Object.keys(data) : filter
  return _(dataList.map((category) => {
    return data[category] || null
  })).compact().sort(sortingTool).value()
}
