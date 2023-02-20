import { getResponse } from 'public/tools/response'
import { getService, getStorage, env } from 'vc-cake'
import { spinnerHtml } from 'public/tools/spinnerHtml'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const shortcodeAssetsStorage = getStorage('shortcodeAssets')
const { getShortcodesRegexp } = getService('utils')

const requests = {}

export function renderInlineHtml (content, jsonData, ref, id, finishCallback) {
  const iframe = env('iframe')
  try {
    ((function (window, document) {
      const { headerContent, shortcodeContent, footerContent } = jsonData
      ref && (ref.innerHTML = '')
      const freezeReady = dataManager.get('freezeReady')
      freezeReady && freezeReady(id, true)
      const headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
      headerDom.context = document
      shortcodeAssetsStorage.trigger('add', { type: 'header', ref: ref, shadowDom: headerDom, ignoreCache: true }, () => {
        let newShortCodeContent = shortcodeContent
        if (shortcodeContent.includes('document.write')) {
          newShortCodeContent = 'This script cannot be rendered in the editor because document.write is used in your code. However, it will work on the public and preview page.'
        }
        // Once Header assets is added continue with shortcodeContent
        const shortcodeDom = window.jQuery('<div>' + newShortCodeContent + '</div>', document)
        shortcodeDom.context = document
        shortcodeAssetsStorage.trigger('add', { type: 'shortcode', ref: ref, shadowDom: shortcodeDom, ignoreCache: true }, () => {
          // Once Element Content Assets is added continue with footerContent
          const footerDom = window.jQuery('<div>' + footerContent + '</div>', document)
          footerDom.context = document
          shortcodeAssetsStorage.trigger('add', { type: 'footer', ref: ref, shadowDom: footerDom, ignoreCache: true }, finishCallback)
        })
      })
    })(iframe, iframe.document))
  } catch (e) {
    console.warn('failed to parse json', e)
    ref && (ref.innerHTML = content)
    finishCallback()
  }
}

export function updateHtmlWithServer (content, ref, id, cb, action, options) {
  if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || (content.indexOf('<!-- wp') !== -1 && content.indexOf('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block') === -1))) {
    ref.innerHTML = spinnerHtml
    updateHtmlWithServerRequest(content, ref, id, cb, action, options)
  } else {
    ref && (ref.innerHTML = content)
    requests[id] = null
    cb && cb.constructor === Function && cb()
  }
}

export function addShortcodeToQueueUpdate (content, ref, id, cb, action, options) {
  if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || (content.indexOf('<!-- wp') !== -1 && content.indexOf('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block') === -1))) {
    ref.innerHTML = spinnerHtml
    addServerRequestShortcodeToQueue(content, ref, id, cb, action, options)
  } else {
    ref && (ref.innerHTML = content)
    requests[id] = null
    cb && cb.constructor === Function && cb()
  }
}

export function addServerRequestShortcodeToQueue (content, ref, id, cb, action = 'update', options = {}) {
  window.vcv_server_request_shortcode_queue = window.vcv_server_request_shortcode_queue || []
  window.vcv_shortcode_reference_list = window.vcv_shortcode_reference_list || []

  window.vcv_server_request_shortcode_queue.push(content)

  window.vcv_shortcode_reference_list.push({
    id: id,
    ref: ref,
    cb: cb,
    action: action,
    options: options,
    content: content
  })
}

export function setShortcodeListHtmlServerRequest () {
  if (!window.vcv_server_request_shortcode_queue || !window.vcv_shortcode_reference_list) {
    return
  }

  dataProcessor.appServerRequest({
    'vcv-action': 'elements:ajaxShortcodes:get:html:all:adminNonce',
    'vcv-shortcode-list': window.vcv_server_request_shortcode_queue,
    'vcv-source-id': dataManager.get('sourceID'),
    'vcv-nonce': dataManager.get('nonce')
  }).then((data) => {
    const shortcodeReferenceList = window.vcv_shortcode_reference_list

    const shortcodeRenderResponse = getResponse(data)

    for (var index in shortcodeRenderResponse) {
      for (const shortcodeReference of shortcodeReferenceList) {
        if (shortcodeRenderResponse[index].shortcodeInitContent === shortcodeReference.content) {
          shortcodeReferenceList[index].renderedContent = shortcodeRenderResponse[index].shortcodeRenderContent
        }
      }
    }

    for (const shortcodeReference of shortcodeReferenceList) {
      const iframe = env('iframe')

      const cb = shortcodeReference.cb
      const ref = shortcodeReference.ref
      const action = shortcodeReference.action
      const options = shortcodeReference.options
      const content = shortcodeReference.content
      const renderedContent = shortcodeReference.renderedContent
      const id = shortcodeReference.id

      const finishCallback = () => {
        ((function (window) {
          window.setTimeout(() => {
            const freezeReady = dataManager.get('freezeReady')
            freezeReady && freezeReady(id, false)
            window.vcv && window.vcv.trigger('ready', action, id, options)
            requests[id] = null
            cb && cb.constructor === Function && cb()
          }, 500)
        })(iframe))
      }

      try {
        renderInlineHtml(content, renderedContent, ref, id, finishCallback)
      } catch (e) {
        console.warn('failed to parse json', e)
        ref && (ref.innerHTML = content)
        finishCallback()
      }
    }
  })
}

export function updateHtmlWithServerRequest (content, ref, id, cb, action = 'update', options = {}) {
  requests[id] = dataProcessor.appServerRequest({
    'vcv-action': 'elements:ajaxShortcode:adminNonce',
    'vcv-shortcode-string': content,
    'vcv-source-id': dataManager.get('sourceID'),
    'vcv-nonce': dataManager.get('nonce')
  }).then((data) => {
    const iframe = env('iframe')
    const finishCallback = () => {
      ((function (window) {
        window.setTimeout(() => {
          const freezeReady = dataManager.get('freezeReady')
          freezeReady && freezeReady(id, false)
          window.vcv && window.vcv.trigger('ready', action, id, options)
          requests[id] = null
          cb && cb.constructor === Function && cb()
        }, 500)
      })(iframe))
    }
    try {
      const jsonData = getResponse(data)
      if (jsonData) {
        renderInlineHtml(content, jsonData, ref, id, finishCallback)
      } else {
        console.warn('failed to parse data', data)
        ref && (ref.innerHTML = content)
        finishCallback()
      }
    } catch (e) {
      console.warn('failed to parse json', e)
      ref && (ref.innerHTML = content)
      finishCallback()
    }
  })
}
