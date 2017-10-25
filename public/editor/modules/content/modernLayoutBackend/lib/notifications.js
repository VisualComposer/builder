import vcCake from 'vc-cake'
import classNames from 'classnames'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const Utils = vcCake.getService('utils')

export default class Notifications {
  constructor (parent, limit = 3) {
    this.parent = parent
    this.limit = limit
    this.top = []
    this.bottom = []
    this.adminBar = document.getElementById('wpadminbar')
    this.create = this.create.bind(this)
    this.handleNotificationPosition = this.handleNotificationPosition.bind(this)
  }

  init () {
    if (!this.parent) {
      return
    }
    this.createHelpers()
    this.handleNotificationPosition()
    this.addResizeListener(this.container, this.handleNotificationPosition)
    workspaceNotifications.onChange(this.create)
  }

  createHelpers () {
    this.container = document.createElement('div')
    this.container.setAttribute('class', 'vcv-layout-notifications-backend')
    this.topContainer = document.createElement('div')
    this.topContainer.setAttribute('class', 'vcv-layout-notifications-top')
    this.bottomContainer = document.createElement('div')
    this.bottomContainer.setAttribute('class', 'vcv-layout-notifications-bottom')
    this.container.appendChild(this.topContainer)
    this.container.appendChild(this.bottomContainer)
    this.parent.appendChild(this.container)
  }

  create (data) {
    if (!data || !data.text) {
      return
    }
    if (data.cookie && Utils.getCookie(data.cookie)) {
      return
    }
    const pos = data.position && [ 'top', 'bottom' ].indexOf(data.position) >= 0 ? data.position : 'bottom'
    if (this[ pos ].length >= this.limit) {
      this.close(pos, this[ pos ][ 0 ].item, this[ pos ][ 0 ].timeout)
    }
    const parent = pos === 'top' ? this.topContainer : this.bottomContainer
    const type = data.type && [ 'default', 'success', 'warning', 'error' ].indexOf(data.type) >= 0 ? data.type : 'default'
    const time = parseInt(data.time) || 3000
    const item = document.createElement('div')
    const classes = classNames([ `vcv-layout-notifications-position--${pos}`, `vcv-layout-notifications-type--${type}` ])
    item.setAttribute('class', classes)

    const text = document.createElement('div')
    text.setAttribute('class', 'vcv-layout-notifications-text')
    text.innerText = data.text

    let timeout = setTimeout(() => {
      clearTimeout(timeout)
      this.close(pos, item)
    }, time)

    if (data.icon) {
      let iconParent = document.createElement('div')
      iconParent.setAttribute('class', 'vcv-layout-notifications-icon')
      let icon = document.createElement('i')
      icon.setAttribute('class', data.icon)
      iconParent.appendChild(icon)
      item.appendChild(iconParent)
    }

    item.appendChild(text)

    if (data.showCloseButton) {
      let closeButtonParent = document.createElement('div')
      closeButtonParent.setAttribute('class', 'vcv-layout-notifications-close')
      let closeBtn = document.createElement('div')
      closeBtn.setAttribute('class', 'vcv-layout-notifications-close-btn')
      closeBtn.addEventListener('click', this.close.bind(this, pos, item, timeout, data.cookie))
      closeButtonParent.appendChild(closeBtn)
      item.appendChild(closeButtonParent)
    } else {
      item.addEventListener('click', this.close.bind(this, pos, item, timeout, data.cookie))
    }

    parent.appendChild(item)

    this[ pos ].push({ item, timeout })
  }

  close (pos, item, timeout = null, cookie = null) {
    if (timeout) {
      clearTimeout(timeout)
    }
    if (cookie) {
      Utils.setCookie(cookie, true)
    }
    for (let i = 0; i < this[ pos ].length; i++) {
      if (this[ pos ][ i ].item === item) {
        this[ pos ].splice(i, 1)
        break
      }
    }
    item.addEventListener('transitionend', () => {
      item.remove()
    })
    item.classList.add('vcv-layout-notifications-type--disabled')
  }

  handleNotificationPosition () {
    const adminBarPos = window.getComputedStyle(this.adminBar).position
    const adminBarHeight = adminBarPos === 'absolute' ? 0 : this.adminBar.getBoundingClientRect().height

    this.topContainer.style = {}
    this.bottomContainer.style = {}

    const width = this.container && `${this.container.getBoundingClientRect().width}px`
    const leftPos = this.container && `${this.container.getBoundingClientRect().left}px`

    this.topContainer.style.left = leftPos
    this.topContainer.style.width = width
    this.topContainer.style.top = `${adminBarHeight + 20}px`

    this.bottomContainer.style.width = width
    this.bottomContainer.style.left = leftPos
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function () {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }
}
