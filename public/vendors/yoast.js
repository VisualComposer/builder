import vcCake from 'vc-cake'

const utils = vcCake.getService('utils')
const setContent = () => {
  setTimeout(() => {
    const iframe = document.getElementById('vcv-editor-iframe')
    const contentLayout = iframe ? iframe.contentWindow.document.querySelector('[data-vcv-module="content-layout"]') : false
    let content = contentLayout ? utils.normalizeHtml(contentLayout.innerHTML) : ''

    document.getElementById('content').value = content
    let contentTinyMce = window.tinyMCE && window.tinyMCE.get && window.tinyMCE.get('content')
    if (contentTinyMce) {
      contentTinyMce.setContent(content) && contentTinyMce.fire('change')
    }
  }, 100)
}

vcCake.getStorage('wordpressData').state('status').onChange((data) => {
  if (data.status && data.status === 'loaded') {
    setContent()
    vcCake.getStorage('history').state('canUndo').onChange(() => {
      setContent()
    })
  }
})
