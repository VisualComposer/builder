import CommandsRegisterFontSelect from './fontFamily/commandsRegister'
import ButtonsRegisterFontSelect from './fontFamily/buttonsRegister'
import ButtonsRegisterFontWeight from './fontWeight/buttonsRegister'
import ButtonsRegisterFontSize from './fontSize/buttonsRegister'
import ButtonsRegisterLineHeight from './lineHeight/buttonsRegister'
import ButtonsRegisterLetterSpacing from './letterSpacing/buttonsRegister'

import ButtonControl from './fontFamily/buttonControl'

const initializePlugin = function (tinymce, window) {
  const globalPluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager')

  // Register Plugin
  globalPluginManager.add('vcvhtmleditor', function (editor) {
    // Register UI
    const ButtonControlInstance = ButtonControl(tinymce)
    tinymce.ui[ 'VcvFontsSelect' ] = ButtonControlInstance
    tinymce.util.Tools.resolve('tinymce.ui.Factory').add('VcvFontsSelect', ButtonControlInstance)

    // Format commands
    CommandsRegisterFontSelect(editor)

    // TinyMce Buttons callbacks
    ButtonsRegisterFontSelect(editor, window)
    ButtonsRegisterFontWeight(editor, window)
    ButtonsRegisterFontSize(editor, window)
    ButtonsRegisterLineHeight(editor, window)
    ButtonsRegisterLetterSpacing(editor, window)

    // Register formats
    editor.on('init', () => {
      editor.formatter.register('fontweight', {
        inline: 'span',
        toggle: false,
        styles: { fontWeight: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('fontstyle', {
        inline: 'span',
        toggle: false,
        styles: { fontStyle: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('lineheight', {
        selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
        toggle: false,
        styles: { lineHeight: '%value' },
        clear_child_styles: true
      })
      editor.formatter.register('letterspacing', {
        selector: 'span,figure,p,h1,h2,h3,h4,h5,h6,td,th,tr,div,ul,ol,li',
        toggle: false,
        styles: { letterSpacing: '%value' },
        clear_child_styles: true
      })
    })
  })
}

export default initializePlugin
