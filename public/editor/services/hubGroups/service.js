import vcCake from 'vc-cake'

const API = {
  all: () => {
    const allGroups = window.VCV_HUB_GET_GROUPS()

    allGroups.unshift({
      title: 'All',
      metaOrder: 1,
      categories: true
    })

    return allGroups
  },
  groups: () => {
    return window.VCV_HUB_GET_GROUPS()
  }
}

vcCake.addService('hubGroups', API)
