import vcCake from 'vc-cake'
import classNames from 'classnames'

const workspaceStorage = vcCake.getStorage('workspace')
const workspaceNotifications = workspaceStorage.state('notifications')
const Utils = vcCake.getService('utils')

export default class Notifications {
  constructor (parentTop, parentBottom, limit = 3) {
    this.parentTop = parentTop
    this.parentBottom = parentBottom
    this.limit = limit
    this.top = []
    this.bottom = []
    this.create = this.create.bind(this)
    this.handleNotificationResize = this.handleNotificationResize.bind(this)
  }

  init () {
    if (!this.parentTop && !this.parentBottom) {
      return
    }
    this.createHelpers()
    this.handleNotificationResize()
    Utils.addResizeListener(this.parentBottom, {}, this.handleNotificationResize)
    workspaceNotifications.onChange(this.create)
  }

  createHelpers () {
    this.topWrapper = document.createElement('div')
    this.topWrapper.setAttribute('class', 'vcv-layout-notifications-backend')
    this.bottomWrapper = document.createElement('div')
    this.bottomWrapper.setAttribute('class', 'vcv-layout-notifications-backend')
    this.topContainer = document.createElement('div')
    this.topContainer.setAttribute('class', 'vcv-layout-notifications-top')
    this.bottomContainer = document.createElement('div')
    this.bottomContainer.setAttribute('class', 'vcv-layout-notifications-bottom')
    this.topWrapper.appendChild(this.topContainer)
    this.bottomWrapper.appendChild(this.bottomContainer)
    this.parentTop.appendChild(this.topWrapper)
    this.parentBottom.appendChild(this.bottomWrapper)
  }

  create (data) {
    if (!data || !data.text) {
      return
    }
    if (data.cookie && Utils.getCookie(data.cookie)) {
      return
    }
    const pos = data.position && [ 'top', 'bottom' ].indexOf(data.position) >= 0 ? data.position : 'top'
    if (this[ pos ].length >= this.limit) {
      this.close(pos, this[ pos ][ 0 ].item, this[ pos ][ 0 ].timeout, null, true)
    }
    const parent = pos === 'top' ? this.topContainer : this.bottomContainer
    const type = data.type && [ 'default', 'success', 'warning', 'error' ].indexOf(data.type) >= 0 ? data.type : 'default'
    const time = parseInt(data.time) || 3000
    const item = document.createElement('div')
    const classes = classNames({
      [`vcv-layout-notifications-position--${pos}`]: true,
      [`vcv-layout-notifications-type--${type}`]: true,
      'vcv-layout-notifications-style--transparent': data.transparent,
      'vcv-layout-notifications-shape--rounded': data.rounded
    })
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
      closeBtn.addEventListener('click', this.close.bind(this, pos, item, timeout, data.cookie, false))
      closeButtonParent.appendChild(closeBtn)
      item.appendChild(closeButtonParent)
    } else {
      item.addEventListener('click', this.close.bind(this, pos, item, timeout, data.cookie, false))
    }

    parent.appendChild(item)

    this[ pos ].push({ item, timeout })
  }

  close (pos, item, timeout = null, cookie = null, limited = null) {
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
    if (limited) {
      item.classList.add('vcv-layout-notifications-visibility--hidden')
    }
    item.classList.add('vcv-layout-notifications-type--disabled')
  }

  handleNotificationResize () {
    if (this.parentBottom) {
      const parentRect = this.parentBottom.getBoundingClientRect()
      this.bottomContainer.style = {}
      this.bottomContainer.style.left = `${parentRect.left}px`
      this.bottomContainer.style.width = `${parentRect.width}px`
    }
  }
}
