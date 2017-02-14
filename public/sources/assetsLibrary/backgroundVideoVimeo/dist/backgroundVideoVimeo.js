/* global vcv */
/* global vceAssetsBackgroundVideoVimeo */
vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    let selector = `[data-vce-assets-video-vimeo]`
    selector = id ? `[data-vcv-element="${id}"] ${selector}` : selector
    vceAssetsBackgroundVideoVimeo( selector )
  }
})
