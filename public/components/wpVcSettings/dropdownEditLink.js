const $ = window.jQuery

const localizations = window.VCV_I18N && window.VCV_I18N()
const editLinkText404 = localizations && localizations.edit404Template ? localizations.edit404Template : '<div class="{class}"><a href="{link}" target="_blank">Edit</a> this 404-page template.</div>'
const editLinkTextArchive = localizations && localizations.editArchiveTemplate ? localizations.editArchiveTemplate : '<div class="{class}"><a href="{link}" target="_blank">Edit</a> this archive page template.</div>'

const editItemList = [
  {
    'itemID': 'vcv-custom-page-templates-404-page',
    'itemClass': 'vcv-custom-page-templates-404-page-edit-link',
    'itemText': editLinkText404
  },
  {
    'itemID': 'vcv-custom-page-templates-archive-template',
    'itemClass': 'vcv-custom-page-templates-archive-template-edit-link',
    'itemText': editLinkTextArchive
  }
]

const changeEditLink = (itemID, itemClass, itemText) => {
  const dropdownItem = $('#' + itemID)
  const selectedPageUrl = dropdownItem.find('option:selected').attr('data-url')
  const dropdownContainer = dropdownItem.closest('.vcv-ui-form-group').parent('td')
  const editLinkItem = $('.' + itemClass)

  if (dropdownItem.val()) {
    if (editLinkItem.length) {
      editLinkItem.find('a').attr('href', selectedPageUrl)
    } else {
      dropdownContainer.append(itemText.replace('{link}', selectedPageUrl).replace('{class}', itemClass))
    }
  } else {
    editLinkItem.remove()
  }
}

export const dropdownEditLink = () => {
  editItemList.forEach(function (item) {
    const dropdownItem = $('#' + item.itemID)

    // Initial Page Load
    if (dropdownItem.find('option:selected').length) {
      changeEditLink(item.itemID, item.itemClass, item.itemText)
    }

    // Change Event
    dropdownItem.on('change', function () {
      changeEditLink(item.itemID, item.itemClass, item.itemText)
    })
  })
}
