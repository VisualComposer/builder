import { getService } from 'vc-cake'
import 'public/editor/services/stylesManager/service'
import codeEditor from 'public/components/codeEditor/codeEditor'

const initEditors = () => {
  // CSS PART
  const submitBtn = document.querySelector('#submit_btn[name=submit_btn]')
  const setStatus = (status) => {
    if (status === 'ready') {
      submitBtn.classList.remove('disabled')
    } else {
      submitBtn.classList.add('disabled')
    }
  }
  /**
   * Initialise CSS code editor
   * See more @/Modules/Settings/Fields/CssEditor.php
   */
  const globalCssTextarea = document.querySelector('#vcv-settingsGlobalCss')
  const globalCssTextareaCompiled = document.querySelector('#vcv-settingsGlobalCss-compiled')
  if (globalCssTextarea !== null) {
    const globalCssEditor = codeEditor.getEditor(globalCssTextarea, 'text/css', globalCssTextarea.value)
    globalCssEditor.on('change', async () => {
      const newValue = globalCssEditor.getValue()
      setStatus('compiling')
      await build(newValue)
      setStatus('ready')
    })
  }

  let build = (css) => {
    const stylesManagerService = getService('stylesManager')
    const stylesBuilder = stylesManagerService.create()
    stylesBuilder.add({
      src: css
    })
    return stylesBuilder.compile().then((result) => {
      globalCssTextareaCompiled.value = result
    })
  }

  /**
   * Initialise JS code editor
   * See more @/Modules/Settings/Fields/JsEditor.php
   */
  const globalJsHead = document.querySelector('#vcv-settingsGlobalJsHead')
  if (globalJsHead !== null) {
    codeEditor.getEditor(globalJsHead, 'text/html', globalJsHead.value)
  }

  const globalJsFooter = document.querySelector('#vcv-settingsGlobalJsFooter')
  if (globalJsFooter !== null) {
    codeEditor.getEditor(globalJsFooter, 'text/html', globalJsFooter.value)
  }
}

module.exports = {
  initEditors
}
