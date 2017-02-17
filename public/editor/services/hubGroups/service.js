import vcCake from 'vc-cake'

const API = {
  all: () => {
    return window.VCV_HUB_GET_GROUPS()
  }
}

vcCake.addService('hubGroups', API)
