const $ = window.jQuery
const editLinkClass = 'vcv-custom-page-templates-404-page-edit-link'

const localizations = window.VCV_I18N && window.VCV_I18N()
const editLinkText = localizations && localizations.edit ? localizations.edit : 'Edit'

const changeEditLink = () => {
  const dropdownItem = $('#vcv-custom-page-templates-404-page')
  const selectedPageUrl = dropdownItem.find('option:selected').attr('data-url')
  const dropdownContainer = dropdownItem.closest('.vcv-ui-form-group').parent('td')
  const editLinkItem = $('.' + editLinkClass)

  if (dropdownItem.val()) {
    if (editLinkItem.length) {
      editLinkItem.attr('href', selectedPageUrl)
    } else {
      dropdownContainer.append(`<a href='${selectedPageUrl}' class='${editLinkClass}' target='_blank'>${editLinkText}</a>`)
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
