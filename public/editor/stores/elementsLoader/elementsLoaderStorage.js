import {addStorage} from 'vc-cake'
import {default as Loader} from './lib/loader'
addStorage('elementsLoader', (storage) => {
  window.vcvElementsGlobalsUrl = 'http://wp.localhost/wp-admin/admin-ajax.php?vcv-admin-ajax=1&vcv-action=elements%3AglobalVariables%3AadminNonce&action=vcv-admin-ajax'
  window.vcvVendorUrl = 'http://wp.localhost/wp-content/plugins/vcwb-dev/public/dist/vendor.bundle.js'
  const loader = new Loader(window.vcvElementsGlobalsUrl, window.vcvVendorUrl)
  storage.on('start', () => {
    loader.setup()
  })
})
