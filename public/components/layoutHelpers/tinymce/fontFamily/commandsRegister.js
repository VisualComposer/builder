const CommandsRegister = function (editor) {
  const applyFormat = function (editor, value) {
    editor.undoManager.transact(function () {
      editor.focus()
      editor.formatter.apply('fontname', { value: value })
      editor.nodeChanged()
    })
  }
  const removeFormat = function (editor, currentValue) {
    editor.undoManager.transact(function () {
      editor.focus()
      editor.formatter.remove('fontname', { value: currentValue }, null, true)
      editor.nodeChanged()
    })
  }

  editor.addCommand('mceApplyTextFont', function (value) {
    applyFormat(editor, value)
  })
  editor.addCommand('mceRemoveTextFont', function (currentValue) {
    removeFormat(editor, currentValue)
  })
}

export default CommandsRegister
