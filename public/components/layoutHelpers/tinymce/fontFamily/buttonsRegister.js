import loadFonts from './googleFontsLoad'
import getFontFamilies from './getFontFamilies'

const ButtonsRegister = function (editor, window) {
  const $ = window.jQuery

  const getCurrentFontFamily = function (editor) {
    let fontFamily
    editor.dom.getParents(editor.selection.getStart(), function (elm) {
      var value = elm.style['font-family']
      if (value) {
        fontFamily = fontFamily ? fontFamily.replace(/"/g, '') : value.replace(/"/g, '')
      }
    })
    return fontFamily
  }

  const onPostRender = function (editor) {
    return function (e) {
      const ctrl = e.control
      // Wrap by jQuery to fix on('change') issue!!!
      const $ctrl = $(ctrl.$el)

      function clearMenus ($el) {
        $el.is('.vcv-ui-tinymce-fonts-selectbox') ? $el.removeClass('mce-active') : $el.closest('.vcv-ui-tinymce-fonts-selectbox').removeClass('mce-active')
      }

      const $input = $ctrl.find('.vcv-ui-tinymce-fonts-selectbox-font-family')
      const $label = ctrl.$el.find('.vcv-ui-tinymce-fonts-selectbox-label')

      const fontFamilies = getFontFamilies()
      // Element May be changed need to re-render the displayed font-family
      editor.on('init nodeChange', function () {
        const currentFontFamily = getCurrentFontFamily(editor)
        const find = currentFontFamily ? fontFamilies.find(function (i) {
          return i.value ? i.value.replace(/\s/g, '') === currentFontFamily.replace(/\s/g, '') : i.family.replace(/\s/g, '') === currentFontFamily.replace(/\s/g, '')
        }) : false
        if (find) {
          ctrl.state.set('value', find)
          $label.html(currentFontFamily ? (find ? find.family : currentFontFamily) : 'Default Font')
          $input.val(JSON.stringify(find))
        } else {
          $label.html(currentFontFamily || 'Default Font')
          $input.val(currentFontFamily || '')
          ctrl.state.set('value', '')
        }
        clearMenus($ctrl)
      })

      // Once font family is selected we need to change node style
      $input.on('change', function () {
        ctrl.state.set('value', this.value)
        if (!this.value) {
          editor.execCommand('mceRemoveTextFont', getCurrentFontFamily(editor))
        } else {
          const parsedValue = JSON.parse(this.value)
          ctrl.state.set('value', parsedValue)

          editor.execCommand('mceApplyTextFont', parsedValue.value || parsedValue.family)
          if (!parsedValue.defaultFont) {
            loadFonts(editor, parsedValue.family)
          }
        }
      })
    }
  }

  editor.addButton('VcvFontsSelect', {
    type: 'VcvFontsSelect',
    tooltip: 'Font family',
    onPostRender: onPostRender(editor)
  })
}

export default ButtonsRegister
