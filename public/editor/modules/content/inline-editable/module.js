let vcCake = require('vc-cake')
vcCake.add('inline-editable', function (api) {
  let $ = require('jquery')
  let domContainer = $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)
  let cook = vcCake.getService('cook')

  api.module('content-layout').on('element:mount', function (id) {
    tinyMce($('[data-vc-element="' + id + '"]', domContainer), id)
  })

  var tinyMce = function ($el, id) {
    var innerTinymce = $('#vcv-editor-iframe').get(0).contentWindow.tinymce
    // window.tinymce doesnt work
    var $editable = $('.editable', $el)
    if ($editable.length) {
      $editable.each(
        (i, el) => {
          innerTinymce.init({
            target: el,
            inline: true,
            toolbar: 'bold italic | alignleft aligncenter alignright alignjustify',
            setup: function (editor) {
              dragHandler(editor)
              changeHandler(editor, id)
            },
            menubar: false
          })
        }
      )
    }
  }

  function dragHandler (editor) {
    $(editor.targetElm).bind('dragstart dragover drop', function (e) {
      e.preventDefault()
      return false
    })
  }

  function changeHandler (editor, id) {
    editor.on('change', function () {
      var element = cook.getById(id)
      element.set(editor.targetElm.dataset.vcEditableParam, editor.getContent())
      api.request('data:update', id, element.toJS(true))
    })
  }
})
