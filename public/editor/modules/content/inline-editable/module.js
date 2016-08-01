import vcCake from 'vc-cake'
import $ from 'jquery'

const cook = vcCake.getService('cook')

vcCake.add('inline-editable', (api) => {
  let domContainer = $('#vcv-editor', $('#vcv-editor-iframe').get(0).contentWindow.document).get(0)

  api.module('content-layout').on('element:mount', (id) => {
    tinyMce($('[data-vc-element="' + id + '"]', domContainer), id)
  })

  let tinyMce = ($el, id) => {
    let innerTinymce = $('#vcv-editor-iframe').get(0).contentWindow.tinymce
    // window.tinymce doesnt work
    let $editable = $('.editable', $el)
    if ($editable.length) {
      $editable.each(
        (i, el) => {
          innerTinymce.init({
            target: el,
            inline: true,
            toolbar: 'bold italic | alignleft aligncenter alignright alignjustify',
            setup: (editor) => {
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
    $(editor.targetElm).on('dragstart dragover drop', (e) => {
      e.preventDefault()
      return false
    })
  }

  function changeHandler (editor, id) {
    editor.on('change', () => {
      let element = cook.getById(id)
      element.set(editor.targetElm.dataset.vcvEditableParam, editor.getContent())
      api.request('data:update', id, element.toJS(true))
    })
  }
})
