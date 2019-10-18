import webFontLoader from 'webfontloader'

const loadFonts = function (editor, family, loadFontsInTinymce = true) {
  const iframe = document.querySelector('#vcv-editor-iframe')
  const iframeWindow = iframe && iframe.contentWindow

  let iframeSettings = {}
  if (iframeWindow) {
    iframeSettings.context = iframeWindow
  }

  webFontLoader.load({
    google: {
      families: [ `${family}` ]
    },
    ...iframeSettings
  })

  // Load fonts in tinyMce iframe
  if (loadFontsInTinymce) {
    iframeSettings = {}
    if (editor.getWin()) {
      iframeSettings.context = editor.getWin()
    }

    webFontLoader.load({
      google: {
        families: [ `${family}` ]
      },
      ...iframeSettings
    })
  }
}

export default loadFonts
