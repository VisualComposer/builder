import { getService } from 'vc-cake'
import 'public/editor/services/stylesManager/service'
import codeEditor from 'public/components/codeEditor/codeEditor'

export const initEditors = () => {
  window.vcvIsCodeEditorsTouched = false
  // CSS PART
  const submitBtn = document.querySelector('#submit_btn-vcv-global-css-js')
  const setStatus = (status) => {
    if (!window.vcvIsCodeEditorsTouched) {
      window.vcvIsCodeEditorsTouched = true
    }
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
    const globalCssEditor = codeEditor.getEditor(globalCssTextarea, 'css', globalCssTextarea.value)
    globalCssEditor.on('change', async () => {
      const newValue = globalCssEditor.getValue()
      setStatus('compiling')
      await build(newValue)
      setStatus('ready')
    })
  }

  const build = (css) => {
    const stylesManagerService = getService('stylesManager')
    const stylesBuilder = stylesManagerService.create()
    stylesBuilder.add({
      src: css,
      pureCss: true
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
    const globalJsHeadEditor = codeEditor.getEditor(globalJsHead, 'text/html', globalJsHead.value)
    globalJsHeadEditor.on('change', async () => {
      setStatus('ready')
    })
  }

  const globalJsFooter = document.querySelector('#vcv-settingsGlobalJsFooter')
  if (globalJsFooter !== null) {
    const globalJsFooterEditor = codeEditor.getEditor(globalJsFooter, 'text/html', globalJsFooter.value)
    globalJsFooterEditor.on('change', async () => {
      setStatus('ready')
    })
  }
}
