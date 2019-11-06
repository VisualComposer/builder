const $ = window.jQuery
const editLinkClass = 'vcv-custom-page-templates-404-page-edit-link'
const editLinkItem = '.' + editLinkClass
const dropdownID = '#vcv-custom-page-templates-404-page'

const localizations = window.VCV_I18N && window.VCV_I18N()
const editLinkText = localizations && localizations.edit ? localizations.edit : 'Edit'

const changeEditLink = () => {
  let selectedPageUrl = $(dropdownID).find('option:selected').attr('data-url')
  let dropdownContainer = $(dropdownID).closest('.vcv-ui-form-group').parent('td')

  if (!$(dropdownID).val()) {
    $(editLinkItem).remove()
  } else if ($(editLinkItem).length) {
    $(editLinkItem).attr('href', selectedPageUrl)
  } else {
    dropdownContainer.append(`<a href='${selectedPageUrl}' class='${editLinkClass}' target='_blank'>${editLinkText}</a>`)
  }
}

export const dropdownEditLink = () => {
  // Initial Page Load
  if ($(dropdownID + ' option:selected').length) {
    changeEditLink()
  }

  // Change Event
  $(dropdownID).on('change', function () {
    changeEditLink()
  })
}
