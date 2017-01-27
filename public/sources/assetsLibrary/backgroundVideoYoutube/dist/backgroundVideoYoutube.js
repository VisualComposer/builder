/* global vcv */
/* global vceAssetsBackgroundVideoYoutube */
vcv.on('ready', (action, id) => {
  if (action !== 'reset') {
    let selector = `[data-vce-assets-video-yt]`
    selector = id ? `[data-vcv-element="${id}"] ${selector}` : selector
    vceAssetsBackgroundVideoYoutube( selector )
  }
})
