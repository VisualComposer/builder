import { getService, addService, env } from 'vc-cake'
import { deflate } from 'pako'
import base64 from 'base-64'

// compute once, optimization for recalculate styles
const isRTL = window.getComputedStyle(document.body).direction === 'rtl'

const API = {
  ajaxRequests: [],
  ajaxCall: false,
  base64encode: base64.encode,
  base64decode: base64.decode,
  createKey: () => {
    let uuid = ''

    for (let i = 0; i < 8; i++) {
      const random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16)
    }

    return uuid
  },
  setCookie (cName, value, exDays = 256) {
    const exDate = new Date()
    exDate.setDate(exDate.getDate() + exDays)
    const cValue = encodeURIComponent(value) + (exDays === null ? '' : '; expires=' + exDate.toUTCString())
    document.cookie = cName + '=' + cValue
  },
  getCookie (cName) {
    let i, x, y
    const ARRcookies = document.cookie.split(';')
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='))
      y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x === cName) {
        return decodeURIComponent(y)
      }
    }
  },
  hasCookie (cName) {
    return !!this.getCookie(cName)
  },
  getRealWidth: ($el, $container) => {
    const $tempEl = $el.cloneNode(true)
    let realWidth = 0

    $tempEl.style.position = 'fixed'

    $container.appendChild($tempEl)

    realWidth = $tempEl.offsetWidth
    if (realWidth === 0) {
      $tempEl.remove()
      return 0
    }
    const style = window.getComputedStyle($tempEl, null)
    realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight)
    $tempEl.remove()
    return realWidth
  },
  compressData (data) {
    const binaryStringBuffer = deflate(JSON.stringify(data))
    const dataManager = getService('dataManager')

    if (data['vcv-check-content-zip-type'] || dataManager.get('isBinaryContent')) {
      data = new Blob([new Uint8Array(binaryStringBuffer)], { type: 'application/octet-stream' })
    } else {
      let binary = ''
      const bytes = new Uint8Array(binaryStringBuffer)
      const len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }

      data = base64.encode(binary)
    }

    return data
  },
  ajax: (data, successCallback, failureCallback) => {
    const dataManager = getService('dataManager')
    const request = new window.XMLHttpRequest()
    request.open('POST', dataManager.get('adminAjaxUrl'), true)
    request.onload = (response) => {
      if (request.status >= 200 && request.status < 400) {
        successCallback(request)
      } else {
        if (typeof failureCallback === 'function') {
          failureCallback(request)
        }
      }
    }
    request.onerror = (response) => {
      if (typeof failureCallback === 'function') {
        failureCallback(request)
      }
    }

    let sendArgs = window.jQuery.param(data)

    if (env('VCV_JS_SAVE_ZIP') === false) {
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    } else {
      const utils = getService('utils')
      const compressed = utils.compressData(data)

      if (compressed instanceof Blob) {
        request.setRequestHeader('Content-type', 'application/octet-stream')
        request.setRequestHeader('Content-Transfer-Encoding', 'binary')
        sendArgs = compressed
      } else {
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

        data = {
          'vcv-zip': compressed
        }
        sendArgs = window.jQuery.param(data)
      }
    }

    request.send(sendArgs)

    return request
  },
  normalizeHtml (data) {
    data = data
      .replace(/\s*\bdata-vcv-[^"<>]+"[^"<>]+"+/g, '')
      .replace(/<!--\[vcvSourceHtml]/g, '')
      .replace(/\[\/vcvSourceHtml]-->/g, '')
    // .replace(/&quot;/g, "'")
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(data)

    let helper = documentFragment.querySelector('vcvhelper, .vcvhelper')

    while (helper) {
      const parentNode = helper.parentNode
      const sourceHtml = helper.getAttribute('data-vcvs-html')
      if (sourceHtml) {
        const textNode = range.createContextualFragment(sourceHtml)
        parentNode.insertBefore(textNode, helper)
      }
      parentNode.removeChild(helper)
      helper = documentFragment.querySelector('vcvhelper, .vcvhelper')
    }

    const deleteAttribute = 'data-vce-delete-attr'
    let deleteAttrElements = documentFragment.querySelectorAll(`[${deleteAttribute}]`)
    deleteAttrElements = [].slice.call(deleteAttrElements)
    deleteAttrElements.forEach((node) => {
      const attributesToDelete = node.getAttribute(deleteAttribute)
      attributesToDelete.split(' ').forEach((attr) => {
        node.removeAttribute(attr)
      })
      node.removeAttribute(deleteAttribute)
    })

    let html = ''
    let elementChildren = [].slice.call(documentFragment.childNodes)
    elementChildren = elementChildren.filter((child) => {
      return child.nodeType === document.ELEMENT_NODE || child.nodeType === document.COMMENT_NODE
    })

    for (let i = 0; i < elementChildren.length; i++) {
      if (elementChildren[i].nodeType === document.ELEMENT_NODE) {
        html += elementChildren[i].outerHTML
      } else if (elementChildren[i].nodeType === document.COMMENT_NODE) {
        html += `<!-- ${elementChildren[i].nodeValue.trim()} -->`
      }
    }
    const urlRegex = /url\(\s*(['"]?)(.*?)\1\s*\)/g
    const encodedUrls = html.match(urlRegex)
    if (encodedUrls && encodedUrls.length) {
      const decodedUrls = encodedUrls.map(url => url.replace(/&quot;/g, "'"))
      encodedUrls.forEach((url, i) => {
        html = html.replace(url, decodedUrls[i])
      })
    }

    return html
  },
  getTextContent (data) {
    data = data
      .replace(/\s*\bdata-vcv-[^"<>]+"[^"<>]+"+/g, '')
      .replace(/<!--\[vcvSourceHtml]/g, '')
      .replace(/\[\/vcvSourceHtml]-->/g, '')
      .replace(/<\//g, ' </')
    // .replace(/&quot;/g, "'")
    // TODO: filter HTML for shortcodes
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(data)

    let helper = documentFragment.querySelector('style, script, noscript, meta, title, .vcv-ui-blank-row-container, .vcv-row-control-container')

    while (helper) {
      const parentNode = helper.parentNode
      parentNode.removeChild(helper)
      helper = documentFragment.querySelector('style, script, noscript, meta, title, .vcv-ui-blank-row-container, .vcv-row-control-container')
    }

    return documentFragment.textContent.trim()
  },
  slugify (str) {
    str = str || ''
    return str.toString().toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
      .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
      .replace(/^-+|-+$/g, '').trim() // remove leading, trailing -
  },
  wpAutoP (string, id = 'content') {
    if (window.tinyMCEPreInit.mceInit[id] && window.tinyMCEPreInit.mceInit[id].wpautop &&
      window.switchEditors && window.switchEditors.wpautop) {
      return window.switchEditors.wpautop(string)
    }
    return string
  },
  checkIfElementIsHidden (el) {
    const documentManager = getService('document')
    if (el.hidden) {
      return true
    } else if (el.parent) {
      const elParent = documentManager.get(el.parent)
      if (elParent) {
        if (elParent.parent && elParent.parent === el.id) {
          return true
        } else {
          return this.checkIfElementIsHidden(elParent)
        }
      } else {
        return false
      }
    } else {
      return false
    }
  },
  getVisibleElements (allElements) {
    const visibleElements = Object.assign({}, allElements)
    const checkIfHidden = (el) => {
      if (el.hidden) {
        return true
      } else if (el.parent && allElements[el.parent]) {
        const elParent = allElements[el.parent]
        if (elParent.parent && elParent.parent === el.id) {
          // For templates with corrupted data (to remove infinite loading VC-434)
          return true
        } else {
          return checkIfHidden(allElements[el.parent])
        }
      } else {
        return false
      }
    }

    Object.keys(visibleElements).forEach((id) => {
      const currentElement = visibleElements[id]
      const isHidden = checkIfHidden(currentElement)
      if (isHidden) {
        delete visibleElements[id]
      }
    })
    return visibleElements
  },
  fixCorruptedElements (allElements) {
    // it checks for corrupted element data, when it goes in loop - parent element is the child of his own child
    const elements = Object.assign({}, allElements)
    let parentIds = []
    const checkIfValidParent = (el) => {
      if (el && el.parent) {
        if (parentIds.indexOf(el.parent) >= 0) {
          el.parent = false
          return false
        } else {
          parentIds.push(el.parent)
          return checkIfValidParent(elements[el.parent])
        }
      } else {
        parentIds = []
        return true
      }
    }

    Object.keys(elements).forEach((id) => {
      const currentElement = elements[id]
      checkIfValidParent(currentElement)
      parentIds = []
    })
    return elements
  },
  buildVariables (variables) {
    if (variables.length) {
      variables.forEach((item) => {
        if (typeof window[item.key] === 'undefined') {
          if (item.type === 'constant') {
            window[item.key] = function () { return item.value }
          } else {
            window[item.key] = item.value
          }
        }
      })
    }
  },
  isRTL () {
    return isRTL
  },
  startDownload (tag, data, successCallback, errorCallback) {
    this.ajaxRequests.push({ tag: tag, data: data, successCallback: successCallback, errorCallback: errorCallback })
    this.nextDownload()
  },
  nextDownload () {
    if (this.ajaxRequests.length === 0) {
      return
    }
    if (this.ajaxCall) {
      return
    }
    this.ajaxCall = true
    const dataProcessor = getService('dataProcessor')
    const req = this.ajaxRequests[0]
    dataProcessor.appAdminServerRequest(req.data).then(
      (response) => {
        this.ajaxCall = false
        this.ajaxRequests.splice(0, 1)
        req.successCallback && req.successCallback(response)
        this.nextDownload()
      },
      (response) => {
        this.ajaxCall = false
        this.ajaxRequests.splice(0, 1)
        req.errorCallback && req.errorCallback(response)
        this.nextDownload()
      }
    )
  },
  getShortcodesRegexp () {
    return new RegExp('\\[(\\[?)([\\w|-]+\\b)(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)')
  },
  getBlockRegexp (onlyVcvDynamic = true) {
    // NOTE!! This should be used only for dynamic fields!
    if (onlyVcvDynamic) {
      return new RegExp(/<!--\s+(\/)?wp:(vcv-gutenberg-blocks\/)(dynamic-field-block)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g)
    }

    return new RegExp(/<!--\s+(\/)?wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g)
  },
  parseDynamicBlock (value) {
    if (value.match(API.getBlockRegexp())) {
      const blockInfo = value.split(API.getBlockRegexp())
      return {
        value: value,
        blockScope: blockInfo[2],
        blockName: blockInfo[3],
        blockAtts: JSON.parse(blockInfo[4].trim()),
        blockContent: blockInfo[7],
        beforeBlock: blockInfo[0] || '',
        afterBlock: blockInfo[14] || ''
      }
    }

    return false
  },
  generateQuerySelector (el) {
    if (el.tagName.toLowerCase() === 'html') {
      return 'HTML'
    }

    let str = el.tagName
    str += (el.id !== '') ? '#' + el.id : ''
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.split(/\s/)
      for (let i = 0; i < classes.length; i++) {
        str += '.' + classes[i]
      }
    }
    return API.generateQuerySelector(el.parentNode) + ' > ' + str
  }
}
addService('utils', API)
