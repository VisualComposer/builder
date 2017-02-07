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

AssetsLibrary.add('backgroundSimple', {
  publicCss: [
    'assetsLibrary/backgroundSimple/dist/backgroundSimple.css'
  ]
})

AssetsLibrary.add('backgroundColorGradient', {
  publicCss: [
    'assetsLibrary/backgroundColorGradient/dist/backgroundColorGradient.css'
  ]
})

AssetsLibrary.add('backgroundVideoYoutube', {
  publicCss: [
    'assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.css'
  ],
  publicJs: [
    'assetsLibrary/youtubeIFrameAPI/init.js',
    'assetsLibrary/backgroundVideoYoutube/plugin.js',
    'assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.js'
  ]
})

AssetsLibrary.add('backgroundVideoVimeo', {
  publicCss: [
    'assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.css'
  ],
  publicJs: [
    'assetsLibrary/vimeoPlayerAPI/init.js',
    'assetsLibrary/backgroundVideoVimeo/plugin.js',
    'assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.js'
  ]
})

AssetsLibrary.add('backgroundVideoEmbed', {
  publicCss: [
    'assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.css'
  ],
  publicJs: [
    'assetsLibrary/backgroundVideoEmbed/plugin.js',
    'assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.js'
  ]
})

AssetsLibrary.add('parallaxBackground', {
  publicCss: [
    'assetsLibrary/parallaxBackground/dist/parallax.css'
  ],
  publicJs: [
    'assetsLibrary/waypoints/lib/noframework.waypoints.js',
    'assetsLibrary/parallaxBackground/plugin.js',
    'assetsLibrary/parallaxBackground/dist/parallax.js'
  ]
})

AssetsLibrary.add('youtubeIFrameAPI', {
  publicJs: [
    'assetsLibrary/youtubeIFrameAPI/init.js'
  ]
})

AssetsLibrary.add('vimeoPlayerAPI', {
  publicJs: [
    'assetsLibrary/vimeoPlayerAPI/init.js'
  ]
})
vcCake.addService('assets-library', AssetsLibrary)
