import vcCake from 'vc-cake'
import MobileDetect from 'mobile-detect'
import '../polyfills/index'
import 'public/sources/less/bootstrap/init.less'
import 'public/sources/css/wordpress.less'
import 'public/variables'
import 'public/config/wp-services'
import 'public/config/wp-attributes'

const $ = window.jQuery

export const start = (callback) => {
  callback()
  let $iframeContainer = $('.vcv-layout-iframe-container')
  let $iframe = $iframeContainer.find('#vcv-editor-iframe')
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
    $(iframeDocument.body).on('click', 'a[href]:not([data-vcv-link])', (e) => {
      e && e.preventDefault()
    })
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      $(iframeDocument.body).on('contextmenu', 'a[href]', (e) => {
        e && e.preventDefault()
        e && e.stopPropagation()
      })
    }
    $(iframeDocument.body).on('click', '[type="submit"]', (e) => {
      e && e.preventDefault() && e.stopPropagation()
    })
    let iframeStyles = iframeDocument.createElement('style')
    iframeStyles.setAttribute('type', 'text/css')
    iframeStyles.innerText = `html {
      margin-top: 0px !important;
    }`
    iframeDocument.head.appendChild(iframeStyles)
    if (mobileDetect.mobile() && mobileDetect.os() === 'iOS') {
      let style = iframeDocument.createElement('style')
      style.setAttribute('type', 'text/css')
      style.innerText = `
      html, body {
        height: 100%;
        width: 100vw;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        -webkit-user-select: none;
        user-select: none;
      }
      a[href] {
        -webkit-touch-callout: none !important;
      }`
      iframeDocument.head.appendChild(style)
    }
    if (vcCake.env('VCV_JS_THEME_EDITOR')) {
      const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'
      if (editorType === 'sidebar') {
        let style = iframeDocument.createElement('style')
        style.setAttribute('type', 'text/css')
        style.innerText = `html {
        background: #292929;
        display: flex;
        justify-content: center;
        }`
        style.innerText += 'body {'
        style.innerText += 'width: 320px;'
        style.innerText += '}'
        iframeDocument.head.appendChild(style)
      }
      if ((editorType === 'header' || editorType === 'footer')) {
        let style = iframeDocument.createElement('style')
        style.setAttribute('type', 'text/css')
        style.innerText = 'html {'
        style.innerText += 'display: flex;'
        style.innerText += 'min-height: 100%;'
        style.innerText += 'flex-direction: column;'
        if (editorType === 'header') {
          style.innerText += 'justify-content: flex-start;'
        } else {
          style.innerText += 'justify-content: flex-end;'
        }
        style.innerText += 'background: #292929;'
        style.innerText += 'overflow-x: hidden;'
        style.innerText += '}'
        iframeDocument.head.appendChild(style)
      }
    }
    $('[data-vcv="edit-fe-editor"]', iframeDocument).remove()

    vcCake.env('platform', 'wordpress').start(() => {
      vcCake.env('editor', 'frontend')
      require('../../editor/stores/events/eventsStorage')
      require('../../editor/stores/elements/elementsStorage')
      require('../../editor/stores/assets/assetsStorage')
      require('../../editor/stores/shortcodesAssets/storage')
      require('../../editor/stores/cacheStorage')
      require('../../editor/stores/migrationStorage')

      require('../../editor/stores/workspaceStorage')
      require('../../editor/stores/hub/hubElementsStorage')
      require('../../editor/stores/hub/hubTemplatesStorage')
      require('../../editor/stores/hub/hubAddonsStorage')
      const hubElementsStorage = vcCake.getStorage('hubElements')
      hubElementsStorage.trigger('start')
      const hubTemplatesStorage = vcCake.getStorage('hubTemplates')
      hubTemplatesStorage.trigger('start')
      const hubAddonsStorage = vcCake.getStorage('hubAddons')
      hubAddonsStorage.trigger('start')
      require('../../editor/stores/sharedAssets/storage')
      const sharedAssetsStorage = vcCake.getStorage('sharedAssets')
      sharedAssetsStorage.trigger('start')
      require('../../editor/stores/history/historyStorage')
      require('../../editor/stores/settingsStorage')
      const settingsStorage = vcCake.getStorage('settings')
      settingsStorage.trigger('start')
      require('../../editor/stores/notifications/storage')
      require('../../editor/stores/wordpressData/wordpressDataStorage')
      // require('./editor/stores/elementsLoader/elementsLoaderStorage')
      require('../../config/wp-modules')
    })

    vcCake.env('iframe', iframe)
    if ($iframe && $iframe.get(0).contentWindow) {
      const settingsStorage = vcCake.getStorage('settings')
      let beforeMainUnload = false
      window.addEventListener('beforeunload', function () {
        beforeMainUnload = true
      })
      $iframe.get(0).contentWindow.onunload = function () {
        if (beforeMainUnload) {
          // Fixes performance drownback due to cssBuilder trigger vcv.ready destroy
          return
        }
        let lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() && window.VCV_PAGE_TEMPLATES().current)
        if (!vcCake.env('VCV_JS_THEME_EDITOR') && vcCake.env('VCV_JS_THEME_LAYOUTS')) {
          let lastSavedPageTemplate = window.vcvLastLoadedPageTemplate = settingsStorage.state('pageTemplate').get()
          let lastSavedHeaderTemplate = window.vcvLastLoadedHeaderTemplate = settingsStorage.state('headerTemplate').get()
          let lastSavedSidebarTemplate = window.vcvLastLoadedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()
          let lastSavedFooterTemplate = window.vcvLastLoadedFooterTemplate = settingsStorage.state('footerTemplate').get()
          vcCake.getStorage('workspace').state('iframe').set({
            type: 'reload',
            template: lastSavedPageTemplate,
            header: lastSavedHeaderTemplate,
            sidebar: lastSavedSidebarTemplate,
            footer: lastSavedFooterTemplate
          })
        } else {
          let lastSavedPageTemplate = vcCake.getStorage('settings').state('pageTemplate').get() || lastLoadedPageTemplate
          window.vcvLastLoadedPageTemplate = lastSavedPageTemplate
          vcCake.getStorage('workspace').state('iframe').set({
            type: 'reload',
            template: lastSavedPageTemplate
          })
        }
        settingsStorage.state('skipBlank').set(true)
        isIframeLoaded = false
      }

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
  }

  $iframe.on('load', iframeLoadEvent)

  let checkForLoad = () => {
    if (!isIframeLoaded) {
      // Get a handle to the iframe element
      let iframe = $iframe.get(0)
      let iframeDoc = iframe.contentDocument && iframe.contentWindow.document
      // Check if loading is complete
      const isContentLoaded = iframeDoc ? iframeDoc.body &&
        iframeDoc.body.querySelector('#vcv-editor') : false

      if (iframeDoc && iframeDoc.readyState === 'complete' && isContentLoaded) {
        iframeLoadEvent()
        return
      }

      window.setTimeout(() => {
        checkForLoad()
      }, 1000)
    }
  }

  window.setTimeout(() => {
    checkForLoad()
  }, 100)
}
