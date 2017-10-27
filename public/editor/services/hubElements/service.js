import vcCake from 'vc-cake'

let elements = window.VCV_HUB_GET_ELEMENTS()

const API = {
  all: () => {
    return elements
  },
  add: (data) => {
    elements[ data.tag ] = data
  }
}

vcCake.addService('hubElements', API)
