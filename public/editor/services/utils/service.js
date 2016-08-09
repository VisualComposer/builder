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
  }
}
vcCake.addService('utils', API)
