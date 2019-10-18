import getFontFamilies from './getFontFamilies'

const ButtonControl = function (tinymce) {
  const getFontFamilyList = function () {
    let list = []
    let offset = 25
    getFontFamilies().forEach((item, i) => {
      const family = item.hasOwnProperty('value') ? item.value : item.family
      let familyStyle = ''
      if (family.length) {
        familyStyle = `background-position: 10px ${offset - 25}px;`
        offset -= 25
      } else {
        familyStyle = 'background: none;text-indent: 0;'
      }
      list.push(`<li><a tabindex="-1" href="javascript:;" style="${familyStyle}" data-option='${JSON.stringify(item)}'>${item.family}</a></li>`)
    })

    return list.join('')
  }
  return tinymce.ui.Widget.extend({
    renderHtml: function () {
      const self = this
      const id = self._id

      return `<div id="${id}" tabindex="-1" class="${self.classes} vcv-ui-tinymce-fonts-selectbox mce-widget mce-menubtn mce-btn-has-text mce-fixed-width mce-btn mce-listbox" aria-labelledby="${id}" role="button" aria-label="Font Family" aria-haspopup="true">
        <input type="hidden" value="" class="vcv-ui-tinymce-fonts-selectbox-font-family" />
        <button class="vcv-ui-tinymce-fonts-selectbox-toggle vcv-ui-form-group" role="presentation" tabindex="-1" data-toggle="vcv-ui-tinymce-fonts-selectbox">
         <span class="vcv-ui-tinymce-fonts-selectbox-label mce-txt">Default Font</span><i class="mce-caret"></i>
        </button>
        <div class="vcv-ui-tinymce-fonts-selectbox-options">
          <input type="text" class="vcv-ui-tinymce-fonts-selectbox-filter vcv-ui-form-input">
          <div role="listbox">
            <ul role="option">${getFontFamilyList()}</ul>
          </div>
        </div>
      </div>`
    }
  })
}

export default ButtonControl
