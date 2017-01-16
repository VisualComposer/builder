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
    'assetsLibrary/waypoints/lib/noframework.waypoints.js',
    'assetsLibrary/animate/dist/animate.js'
  ]
})

AssetsLibrary.add('iconpicker', {
  publicCss: [
    'assetsLibrary/iconpicker/css/styles.css'
  ]
})

AssetsLibrary.add('backgroundSlider', {
  publicCss: [
    'assetsLibrary/backgroundSlider/dist/backgroundSlider.css'
  ],
  publicJs: [
    'assetsLibrary/backgroundSlider/dist/plugin.js',
    'assetsLibrary/backgroundSlider/dist/backgroundSlider.js'
  ]
})

vcCake.addService('assets-library', AssetsLibrary)
