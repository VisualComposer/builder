import { addStorage } from 'vc-cake'
import Loader from './lib/loader'
addStorage('elementsLoader', (storage) => {
  window.vcvElementsGlobalsUrl = '/wp-admin/admin-ajax.php?vcv-admin-ajax=1&vcv-action=elements%3AglobalVariables%3AadminNonce&action=vcv-admin-ajax'
  window.vcvVendorUrl = '/wp-content/plugins/vcwb-dev/public/dist/vendor.bundle.js'
  const loader = new Loader(window.vcvElementsGlobalsUrl, window.vcvVendorUrl)
  storage.on('start', () => {
    loader.setup()
  })
})
