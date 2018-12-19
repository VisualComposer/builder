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
    this.create = this.create.bind(this)
  }

  init () {
    if (!this.parent) {
      return
    }
    this.createHelpers()
    workspaceNotifications.onChange(this.create)
  }

  createHelpers () {
    this.container = document.createElement('div')
    this.container.setAttribute('class', 'vcv-layout-notifications')
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
    if (data.cookie) {
      let cookieName = ''
      if (data.cookie.constructor === Object && data.cookie.name) {
        cookieName = data.cookie.name
      } else if (data.cookie.constructor === String) {
        cookieName = data.cookie
      }
      if (Utils.getCookie(cookieName)) {
        return
      }
    }
    const pos = data.position && [ 'top', 'bottom' ].indexOf(data.position) >= 0 ? data.position : 'top'

    if (data.id && this[ pos ].find((i) => { return i.id && i.id === data.id })) {
      // Already added notification
      return
    }
    if (this[ pos ].length >= this.limit) {
      this.close(pos, this[ pos ][ 0 ].item, this[ pos ][ 0 ].timeout)
    }
    const parent = pos === 'top' ? this.topContainer : this.bottomContainer
    const type = data.type && [ 'default', 'success', 'warning', 'error' ].indexOf(data.type) >= 0 ? data.type : 'default'
    const time = parseInt(data.time) || 3000
    const item = document.createElement('div')
    const classes = classNames({
      [ `vcv-layout-notifications-position--${pos}` ]: true,
      [ `vcv-layout-notifications-type--${type}` ]: true,
      'vcv-layout-notifications-style--transparent': data.transparent,
      'vcv-layout-notifications-shape--rounded': data.rounded
    })
    item.setAttribute('class', classes)

    const text = document.createElement('div')
    text.setAttribute('class', 'vcv-layout-notifications-text')
    if (data.html) {
      text.innerHTML = data.text
    } else {
      text.innerText = data.text
    }

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

    let itemPosData = { item, timeout }
    if (data.id) {
      itemPosData.id = data.id
    }
    this[ pos ].push(itemPosData)
  }

  close (pos, item, timeout = null, cookie = null) {
    if (timeout) {
      clearTimeout(timeout)
    }
    if (cookie) {
      if (cookie.constructor === Object) {
        Utils.setCookie(cookie.name, true, cookie.expireInDays)
      } else if (cookie.constructor === String) {
        Utils.setCookie(cookie, true)
      }
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
}
