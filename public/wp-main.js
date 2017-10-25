import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
// import React from 'react'
import './polyfills'
import './sources/less/bootstrap/init.less'
import './sources/css/wordpress.less'
import './config/variables'
import './config/wp-services'
import './config/wp-attributes'

const $ = require('expose?$!jquery')
$(() => {
  let $iframeContainer = $('.vcv-layout-iframe-container')
  let $iframe = $iframeContainer.find('#vcv-editor-iframe')
  // Get a handle to the iframe element
  let iframe = $iframe.get(0)
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  let isIframeLoaded = false

  let iframeLoadEvent = () => {
    if (!isIframeLoaded) {
      isIframeLoaded = true
    } else {
      return
    }
    let iframe = $iframe.get(0).contentWindow
    let iframeDocument = iframe.document
    // Disable iframe clicks
    $(iframeDocument.body).on('click', 'a[href]', (e) => {
      e && e.preventDefault()
    })
    let iframeStyles = iframeDocument.createElement('style')
    iframeStyles.setAttribute('type', 'text/css')
    iframeStyles.innerText = `html {
      margin-top: 0px !important;
    }`
    iframeDocument.head.appendChild(iframeStyles)
    if (vcCake.env('MOBILE_DETECT')) {
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && mobileDetect.os() === 'iOS') {
        let style = iframeDocument.createElement('style')
        style.setAttribute('type', 'text/css')
        style.innerText = 'html, body {'
        style.innerText += 'height: 100%;'
        style.innerText += 'width: 100vw;'
        style.innerText += 'overflow: auto;'
        style.innerText += '-webkit-overflow-scrolling: touch;'
        style.innerText += '}'
        iframeDocument.head.appendChild(style)
      }
    }
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()
    vcCake.env('platform', 'wordpress').start(() => {
      vcCake.env('editor', 'frontend')
      require('./editor/stores/elements/elementsStorage')
      require('./editor/stores/assets/assetsStorage')
      require('./editor/stores/shortcodesAssets/storage')
      require('./editor/stores/workspaceStorage')
      if (vcCake.env('HUB_TEASER_ELEMENT_DOWNLOAD')) {
        require('./editor/stores/hub/hubElementsStorage')
        const hubElementsStorage = vcCake.getStorage('hubElements')
        hubElementsStorage.trigger('start')
      }
      require('./editor/stores/history/historyStorage')
      require('./editor/stores/settingsStorage')
      require('./editor/stores/wordpressData/wordpressDataStorage')
      require('./config/wp-modules')
    })
    vcCake.env('iframe', iframe)
  }

  $iframe.on('load', iframeLoadEvent)
  // Check if loading is complete
  const isContentLoaded = $iframe.get(0).contentWindow.document.body &&
    $iframe.get(0).contentWindow.document.body.getAttribute('class') &&
    $iframe.get(0).contentWindow.document.body.childNodes.length

  if (iframeDoc && iframeDoc.readyState === 'complete' && isContentLoaded) {
    iframeLoadEvent()
  }

  if (vcCake.env('MOBILE_DETECT')) {
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      $iframeContainer.find('.vcv-layout-iframe-wrapper').addClass('vcv-layout-iframe-container--mobile')

      const $layoutContainer = $('.vcv-layout-container')
      if ($layoutContainer) {
        $layoutContainer.height(window.innerHeight)
        window.addEventListener('resize', () => {
          let height = window.innerHeight
          $layoutContainer.height(height)
        })
      }
    }
  }
})

if (vcCake.env('debug') === true) {
  window.app = vcCake
}
// window.vcvAddElement = vcCake.getService('cook').add
// window.React = React
// window.vcvAPI = vcCake.getService('api')
// if (!vcCake.env('FEATURE_WEBPACK')) {
//   require('./config/elements')
// }

// import './sources/newElements/row'
// import './sources/newElements/column'
// import './sources/newElements/textBlock'
