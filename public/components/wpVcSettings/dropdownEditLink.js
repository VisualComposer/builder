import { getService } from 'vc-cake'
const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')
const editLinkText = localizations && localizations.editThemeTemplate ? localizations.editThemeTemplate : '<div class="vcv-custom-page-templates-edit-link"><a href="{editLink}" target="_blank">Edit</a> this {editLinkTitle} or <a href="{createLink}" target="_blank">create</a> a new one.</div>'

const changeEditLink = (item) => {
  const selectedPageUrl = item.querySelector('option:checked').getAttribute('data-url')
  const editLinkTitle = item.closest('.vcv-ui-form-group').getAttribute('data-title')
  const dropdownContainer = item.closest('.vcv-ui-form-group').closest('td')
  const editLinkItem = dropdownContainer.querySelector('.vcv-custom-page-templates-edit-link')

  if (item.value) {
    if (editLinkItem != null) {
      editLinkItem.querySelector('a').setAttribute('href', selectedPageUrl)
    } else {
      dropdownContainer.insertAdjacentHTML('beforeend', editLinkText.replace('{editLink}', selectedPageUrl).replace('{editLinkTitle}', editLinkTitle).replace('{createLink}', 'post-new.php?post_type=vcv_headers&vcv-action=frontend&vcv-editor-type=vcv_headers'))
      dropdownContainer.closest('tr').classList.add('vcv-field-expand')
    }
  } else {
    editLinkItem.remove()
    dropdownContainer.closest('tr').classList.remove('vcv-field-expand')
  }
}

export const dropdownEditLink = () => {
  const templateDropdowns = document.querySelectorAll('select.vcv-edit-link-selector')

  for (var i = 0, len = templateDropdowns.length; i < len; i++) {
    var item = templateDropdowns[i]
    console.log(item)

    // Initial Page Load
    if (item.querySelector('option:checked') && item.querySelector('option:checked').value !== '') {
      changeEditLink(item)
    }

    item.addEventListener('change', function (item) {
      changeEditLink(item.target)
    }, false)
  }
}
