/* global vcv */
/* global vceAssetsBackgroundSlider */
vcv.on('ready', (action, id) => {
  if (action !== 'reset') {
    vceAssetsBackgroundSlider('[data-vce-assets-slider]')
  }
})
