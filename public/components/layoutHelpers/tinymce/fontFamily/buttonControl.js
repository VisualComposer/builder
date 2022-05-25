import getFontFamilies from './getFontFamilies'

const ButtonControl = function (tinymce) {
  const getFontFamilyList = function () {
    const list = []
    let offset = 22
    getFontFamilies().forEach((item) => {
      let familyStyle = ''
      if (item.family !== 'Default Font') {
        familyStyle = `background-position: 10px ${offset - 22}px;`
        offset -= 22
      } else {
        familyStyle = 'background: none;text-indent: 0;'
      }
      list.push(`<li><a tabindex="-1" href="javascript:;" style="${familyStyle}" data-option='${JSON.stringify(item)}'>${item.family}</a></li>`)
    })

    return list.join('')
  }
  return tinymce.ui.Widget.extend({
    renderHtml: function () {
      const self = this // eslint-disable-line
      const id = self._id

      return `<div id="${id}" tabindex="-1" class="${self.classes} vcv-ui-tinymce-fonts-selectbox mce-widget mce-menubtn mce-btn-has-text mce-fixed-width mce-btn mce-listbox" aria-labelledby="${id}" role="button" aria-label="Font family" aria-haspopup="true">
        <input type="hidden" value="" class="vcv-ui-tinymce-fonts-selectbox-font-family" />
        <button class="vcv-ui-tinymce-fonts-selectbox-toggle" role="presentation" tabindex="-1" data-toggle="vcv-ui-tinymce-fonts-selectbox">
         <span class="vcv-ui-tinymce-fonts-selectbox-label mce-txt">Default Font</span><i class="mce-caret"></i>
        </button>
        <div class="vcv-ui-tinymce-fonts-selectbox-options">
          <div class="vcv-ui-tinymce-fonts-selectbox-input-box">
            <input type="text" class="vcv-ui-tinymce-fonts-selectbox-filter">
          </div>
          <div role="listbox">
            <ul role="option">${getFontFamilyList()}</ul>
          </div>
        </div>
      </div>`
    }
  })
}

export default ButtonControl
