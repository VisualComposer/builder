import vcCake from 'vc-cake'

let data = {}

const AssetsLibrary = {
  add: (key, value) => {
    data[ key ] = value
  },
  get: (key) => {
    return data[ key ]
  },
  all: () => {
    return data
  }
}

AssetsLibrary.add('animate', {
  publicCss: [
    'assetsLibrary/animate/dist/animate.css'
  ],
  publicJs: [
    'assetsLibrary/animate/dist/animate.js'
  ]
})

vcCake.addService('assets-library', AssetsLibrary)
