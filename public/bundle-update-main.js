import $ from 'jquery'
import './sources/less/wpupdates/init.less'

$(() => {
  let redirect = () => {
    if (typeof window.vcvPageBack !== 'undefined') {
      window.location.href = window.vcvPageBack
    } else {
      window.location.reload()
    }
  }

  $.post(window.vcvAccountUrl, {
    'vcv-nonce': window.vcvNonce
  }, redirect).always(redirect)
})
