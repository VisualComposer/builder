window.init_textarea_html = function ($element) {
  var $wp_link, textfield_id, $form_line, $content_holder
  $wp_link = $('#wp-link')
  if ($wp_link.parent().hasClass('wp-dialog')) {
    $wp_link.wpdialog('destroy')
  }
  textfield_id = $element.attr("id")
  $form_line = $element.closest('.edit_form_line')
  $content_holder = $form_line.find('.vc_textarea_html_content')
  try {
    // Init Quicktag
    if (_.isUndefined(tinyMCEPreInit.qtInit[ textfield_id ])) {
      window.tinyMCEPreInit.qtInit[ textfield_id ] = _.extend({},
        window.tinyMCEPreInit.qtInit[ window.wpActiveEditor ],
        { id: textfield_id })
    }
    // Init tinymce
    if (window.tinyMCEPreInit && window.tinyMCEPreInit.mceInit[ window.wpActiveEditor ]) {
      window.tinyMCEPreInit.mceInit[ textfield_id ] = _.extend({},
        window.tinyMCEPreInit.mceInit[ window.wpActiveEditor ],
        {
          resize: 'vertical',
          height: 200,
          id: textfield_id,
          setup: function (ed) {
            if ('undefined' !== typeof(ed.on)) {
              ed.on('init', function (ed) {
                ed.target.focus()
                window.wpActiveEditor = textfield_id
              })
            } else {
              ed.onInit.add(function (ed) {
                ed.focus()
                window.wpActiveEditor = textfield_id
              })
            }
          }
        })
      window.tinyMCEPreInit.mceInit[ textfield_id ].plugins = window.tinyMCEPreInit.mceInit[ textfield_id ].plugins.replace(/,?wpfullscreen/,
        '')
      window.tinyMCEPreInit.mceInit[ textfield_id ].wp_autoresize_on = false
    }
    if (vc.edit_element_block_view && vc.edit_element_block_view.currentModelParams) {
      $element.val(vc_wpautop(vc.edit_element_block_view.currentModelParams[ $content_holder.attr('name') ] || ''))
    } else {
      $element.val($content_holder.val())
    }
    quicktags(window.tinyMCEPreInit.qtInit[ textfield_id ])
    QTags._buttonsInit()
    if (window.tinymce) {
      window.switchEditors && window.switchEditors.go(textfield_id, 'tmce')
      if ("4" === tinymce.majorVersion) {
        tinymce.execCommand('mceAddEditor', true, textfield_id)
      }
    }
    vc_activeMce = textfield_id
    window.wpActiveEditor = textfield_id
  } catch (e) {
    $element.data('vcTinyMceDisabled', true).appendTo($form_line)
    $('#wp-' + textfield_id + '-wrap').remove()
    if (console && console.error) {
      console.error('VC: Tinymce error! Compatibility problem with other plugins.')
      console.error(e)
    }
  }
}