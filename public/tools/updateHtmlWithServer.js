import { getResponse } from 'public/tools/response'
import { getService, getStorage, env } from 'vc-cake'
import { spinnerHtml } from 'public/tools/spinnerHtml'

const dataProcessor = getService('dataProcessor')
const shortcodeAssetsStorage = getStorage('shortcodeAssets')
const { getShortcodesRegexp } = getService('utils')

let requests = {}

export function renderInlineHtml (content, jsonData, ref, id, finishCallback) {
  const iframe = env('iframe')
  try {
    ((function (window, document) {
      const { headerContent, shortcodeContent, footerContent } = jsonData
      ref && (ref.innerHTML = '')
      window.vcvFreezeReady && window.vcvFreezeReady(id, true)
      const headerDom = window.jQuery('<div>' + headerContent + '</div>', document)
      headerDom.context = document
      shortcodeAssetsStorage.trigger('add', { type: 'header', ref: ref, shadowDom: headerDom }, () => {
        // Once Header assets is added continue with shortcodeContent
        const shortcodeDom = window.jQuery('<div>' + shortcodeContent + '</div>', document)
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

export function updateHtmlWithServer (content, ref, id, cb) {
  if (content && (content.match(getShortcodesRegexp()) || content.match(/https?:\/\//) || (content.indexOf('<!-- wp') !== -1 && content.indexOf('<!-- wp:vcv-gutenberg-blocks/dynamic-field-block') === -1))) {
    ref.innerHTML = spinnerHtml
    requests[id] = dataProcessor.appServerRequest({
      'vcv-action': 'elements:ajaxShortcode:adminNonce',
      'vcv-shortcode-string': content,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }).then((data) => {
      const iframe = env('iframe')
      const finishCallback = () => {
        ((function (window) {
          window.setTimeout(() => {
            window.vcvFreezeReady && window.vcvFreezeReady(id, false)
            window.vcv && window.vcv.trigger('ready', 'update', id)
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
  } else {
    ref && (ref.innerHTML = content)
    requests[id] = null
    cb && cb.constructor === Function && cb()
  }
}