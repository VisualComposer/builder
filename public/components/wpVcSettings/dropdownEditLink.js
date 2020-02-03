const $ = window.jQuery

const localizations = window.VCV_I18N && window.VCV_I18N()
const editLinkText = localizations && localizations.editThemeTemplate ? localizations.editThemeTemplate : '<div class="vcv-custom-page-templates-edit-link"><a href="{link}" target="_blank">Edit</a> this {editLinkTitle} template.</div>'

const changeEditLink = (item) => {
  const selectedPageUrl = item.find('option:selected').attr('data-url')
  const editLinkTitle = item.closest('.vcv-ui-form-group').attr('data-title')
  const dropdownContainer = item.closest('.vcv-ui-form-group').parent('td')
  const editLinkItem = dropdownContainer.find('.vcv-custom-page-templates-edit-link')

  if (item.val()) {
    if (editLinkItem.length) {
      editLinkItem.find('a').attr('href', selectedPageUrl)
    } else {
      dropdownContainer.append(editLinkText.replace('{link}', selectedPageUrl).replace('{editLinkTitle}', editLinkTitle))
    }
  } else {
    editLinkItem.remove()
  }
}

export const dropdownEditLink = () => {
  $('.vcv-custom-page-template-dropdown select').each(function () {
    // Initial Page Load
    if ($(this).find('option:selected').length) {
      changeEditLink($(this))
    }

    // Change Event
    $(this).on('change', function () {
      changeEditLink($(this))
    })
  })
}
