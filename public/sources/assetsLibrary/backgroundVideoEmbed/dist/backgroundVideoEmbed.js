/* global vcv */
/* global vceAssetsBackgroundVideoEmbed */
vcv.on('ready', (action, id) => {
  if (action !== 'merge') {
    let selector = `[data-vce-assets-video-embed]`
    selector = id ? `[data-vcv-element="${id}"] ${selector}` : selector
    vceAssetsBackgroundVideoEmbed( selector )
  }
})
