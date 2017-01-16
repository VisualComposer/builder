/* global vcv */
/* global vcvAssetsBackgroundSlider */
vcv.on('ready', (action, id) => {
  if (action !== 'reset') {
    vcvAssetsBackgroundSlider('[data-vcv-assets-slider]')
  }
})
