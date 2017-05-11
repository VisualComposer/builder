import vcCake from 'vc-cake'
const API = {
  createKey: () => {
    let uuid = ''

    for (let i = 0; i < 8; i++) {
      let random = Math.random() * 16 | 0
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-'
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16)
    }

    return uuid
  },
  setCookie (cName, value, exDays = 256) {
    let exDate = new Date()
    exDate.setDate(exDate.getDate() + exDays)
    let cValue = encodeURIComponent(value) + (exDays === null ? '' : '; expires=' + exDate.toUTCString())
    document.cookie = cName + '=' + cValue
  },
  getCookie (cName) {
    let i, x, y
    let ARRcookies = document.cookie.split(';')
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[ i ].substr(0, ARRcookies[ i ].indexOf('='))
      y = ARRcookies[ i ].substr(ARRcookies[ i ].indexOf('=') + 1)
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
    let $tempEl
    let realWidth = 0

    $tempEl = $el.cloneNode(true)
    $tempEl.style.position = 'fixed'

    $container.appendChild($tempEl)

    realWidth = $tempEl.offsetWidth
    if (realWidth === 0) {
      $tempEl.remove()
      return 0
    }
    let style = window.getComputedStyle($tempEl, null)
    realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight)
    $tempEl.remove()
    return realWidth
  },
  addResizeListener: (element, options, fn) => {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = (e) => {
      obj.contentDocument.defaultView.addEventListener('resize', fn.bind(this, element, options))
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  },
  removeResizeListener: (element, options, fn) => {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn.bind(this, element, options))
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  },
  ajax: (data, successCallback, failureCallback) => {
    let request
    request = new window.XMLHttpRequest()
    request.open('POST', window.vcvAjaxUrl, true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
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
    request.send(window.$.param(data))

    return request
  },
  normalizeHtml (data) {
    data = data
      .replace(/\s*\bdata-vcv-[^"]+"[^"]+"+/g, '')
      .replace(/<!\-\-\[vcvSourceHtml]/g, '')
      .replace(/\[\/vcvSourceHtml]\-\->/g, '')
      .replace(/&quot;/g, "'")
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(data)
    let vcvHelper = documentFragment.querySelectorAll('vcvhelper')
    vcvHelper = [].slice.call(vcvHelper)
    vcvHelper.forEach((node) => {
      let parentNode = node.parentNode
      let sourceHtml = node.getAttribute('data-vcvs-html')
      if (sourceHtml) {
        let textNode = range.createContextualFragment(sourceHtml)
        parentNode.insertBefore(textNode, node)
      }
      parentNode.removeChild(node)
    })
    let html = ''
    let elementChildren = documentFragment.children
    // polyfill for IE and Edge
    if (typeof elementChildren === 'undefined') {
      elementChildren = [].slice.call(documentFragment.childNodes)
      elementChildren = elementChildren.filter((child) => {
        return child.nodeType === 1
      })
    }
    for (let i = 0; i < elementChildren.length; i++) {
      html += elementChildren[ i ].outerHTML
    }

    return html
  },
  slugify (str) {
    return str.toString().toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
      .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
      .replace(/^-+|-+$/g, '').trim() // remove leading, trailing -
  }
}
vcCake.addService('utils', API)
