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
const assetsLibraryUrl = window.vcvPluginUrl + 'public/sources/'

AssetsLibrary.add('animate', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/animate/dist/animate.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/waypoints/lib/noframework.waypoints.js',
    assetsLibraryUrl + 'assetsLibrary/animate/dist/animate.js'
  ]
})

AssetsLibrary.add('iconpicker', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/iconpicker/css/styles.css'
  ]
})

AssetsLibrary.add('backgroundSlider', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundSlider/dist/backgroundSlider.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/backgroundSlider/dist/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundSlider/dist/backgroundSlider.js'
  ]
})

AssetsLibrary.add('backgroundSimple', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundSimple/dist/backgroundSimple.css'
  ]
})

AssetsLibrary.add('backgroundColorGradient', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundColorGradient/dist/backgroundColorGradient.css'
  ]
})

AssetsLibrary.add('backgroundVideoYoutube', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/youtubeIFrameAPI/init.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoYoutube/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoYoutube/dist/backgroundVideoYoutube.js'
  ]
})

AssetsLibrary.add('backgroundVideoVimeo', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/vimeoPlayerAPI/init.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoVimeo/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoVimeo/dist/backgroundVideoVimeo.js'
  ]
})

AssetsLibrary.add('backgroundVideoEmbed', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoEmbed/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/backgroundVideoEmbed/dist/backgroundVideoEmbed.js'
  ]
})

AssetsLibrary.add('parallaxBackground', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/parallaxBackground/dist/parallax.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/waypoints/lib/noframework.waypoints.js',
    assetsLibraryUrl + 'assetsLibrary/parallaxBackground/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/parallaxBackground/dist/parallax.js'
  ]
})

AssetsLibrary.add('parallaxFade', {
  publicCss: [
    assetsLibraryUrl + 'assetsLibrary/parallaxFade/dist/parallax.css'
  ],
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/waypoints/lib/noframework.waypoints.js',
    assetsLibraryUrl + 'assetsLibrary/parallaxFade/plugin.js',
    assetsLibraryUrl + 'assetsLibrary/parallaxFade/dist/parallax.js'
  ]
})

AssetsLibrary.add('youtubeIFrameAPI', {
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/youtubeIFrameAPI/init.js'
  ]
})

AssetsLibrary.add('vimeoPlayerAPI', {
  publicJs: [
    assetsLibraryUrl + 'assetsLibrary/vimeoPlayerAPI/init.js'
  ]
})
vcCake.addService('assetsLibrary', AssetsLibrary)
