const $ = window.jQuery
const $separatePostTypeToggle = $('input[name*="headerFooterSettingsSeparatePostType"]')
const $separatePageTypeToggle = $('input[name*="headerFooterSettingsPageType"]')
const $mainHFSDropdown = $('#vcv-headerFooterSettings')
const $toggleCells = $('.vcv-no-title td')

const handleToggle = ($this, $target) => {
  if ($this[0].checked) {
    $target.show()
  } else {
    $target.hide()
  }
}

const handleToggleSections = (value) => {
  const $allSiteSection = $('.vcv-headers-footers_headers-footers-all-site')
  const $separatePostSection = $('.vcv-headers-footers_headers-footers-separate-post-types')

  if (!value) {
    $allSiteSection.addClass('vcv-hidden')
    $separatePostSection.addClass('vcv-hidden')
  } else if (value === 'allSite') {
    $allSiteSection.removeClass('vcv-hidden')
    $separatePostSection.addClass('vcv-hidden')
  } else if (value === 'customPostType') {
    $allSiteSection.addClass('vcv-hidden')
    $separatePostSection.removeClass('vcv-hidden')
  }
}

export const hfSectionToggle = () => {
  // Not in hfs page
  if (!$mainHFSDropdown.length || !$toggleCells) {
    return
  }
  $toggleCells.attr('colspan', '2')
  handleToggleSections($mainHFSDropdown.val())
  $separatePostTypeToggle.each((index, item) => {
    const $item = $(item)
    const $childSection = $item.closest('.vcv-headers-footers-section')
    const $separatePostTypeToggleSections = $childSection.find('.vcv-no-title').nextAll()
    handleToggle($item, $separatePostTypeToggleSections)
  })
  $separatePageTypeToggle.each((index, item) => {
    const $item = $(item)
    const $childSection = $item.closest('.vcv-headers-footers-section')
    const $separatePageTypeToggleSections = $childSection.find('.vcv-no-title').nextAll()
    handleToggle($item, $separatePageTypeToggleSections)
  })
  $separatePostTypeToggle.on('change', function () {
    const $this = $(this)
    const $childSection = $this.closest('.vcv-headers-footers-section')
    const $separatePostTypeToggleSections = $childSection.find('.vcv-no-title').nextAll()
    handleToggle($this, $separatePostTypeToggleSections)
  })
  $separatePageTypeToggle.on('change', function () {
    const $this = $(this)
    const $childSection = $this.closest('.vcv-headers-footers-section')
    const $separatePageTypeToggleSections = $childSection.find('.vcv-no-title').nextAll()
    handleToggle($this, $separatePageTypeToggleSections)
  })

  $mainHFSDropdown.on('change', function () {
    const $this = $(this)
    const value = $this.val()
    handleToggleSections(value)
  })
}
