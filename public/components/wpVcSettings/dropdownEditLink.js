const $ = window.jQuery
const editLinkClass = 'vcv-custom-page-templates-404-page-edit-link'

const localizations = window.VCV_I18N && window.VCV_I18N()
const editLinkText = localizations && localizations.edit404Template ? localizations.edit404Template : '<div class="{class}"><a href="{link}" target="_blank">Edit</a> this 404-page template.</div>'

const changeEditLink = () => {
  const dropdownItem = $('#vcv-custom-page-templates-404-page')
  const selectedPageUrl = dropdownItem.find('option:selected').attr('data-url')
  const dropdownContainer = dropdownItem.closest('.vcv-ui-form-group').parent('td')
  const editLinkItem = $('.' + editLinkClass)

  if (dropdownItem.val()) {
    if (editLinkItem.length) {
      editLinkItem.find('a').attr('href', selectedPageUrl)
    } else {
      dropdownContainer.append(editLinkText.replace('{link}', selectedPageUrl).replace('{class}', editLinkClass))
    }
  } else {
    editLinkItem.remove()
  }
}

export const dropdownEditLink = () => {
  const dropdownItem = $('#vcv-custom-page-templates-404-page')
  // Initial Page Load
  if (dropdownItem.find('option:selected').length) {
    changeEditLink()
  }

  // Change Event
  dropdownItem.on('change', function () {
    changeEditLink()
  })
}
