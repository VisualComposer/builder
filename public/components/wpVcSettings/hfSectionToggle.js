const $ = window.jQuery
const $overrideToggle = $('input[value="headers-footers-override"]')
const $separateToggle = $('input[value="headers-footers-separate"]')
const $separatePostTypeToggle = $('input[name*="headerFooterSettingsSeparatePostType"]')
const $separatePageTypeToggle = $('input[name*="headerFooterSettingsPageType"]')
const $allSiteSection = $overrideToggle.closest('.form-table').next('.vcv-child-section')
const $postTypesSections = $separateToggle.closest('.vcv-headers-footers-section').nextAll()

const $toggleCells = $('.vcv-no-title td')

const handleToggle = ($this, $target) => {
  if ($this[ 0 ].checked) {
    $target.show()
  } else {
    $target.hide()
  }
}

export const hfSectionToggle = () => {
  $toggleCells.attr('colspan', '2')
  handleToggle($overrideToggle, $allSiteSection)
  handleToggle($separateToggle, $postTypesSections)
  $separatePostTypeToggle.each((index, item) => {
    const $item = $(item)
    const $separatePostTypeToggleSections = $item.closest('.vcv-no-title').nextAll()
    handleToggle($item, $separatePostTypeToggleSections)
  })
  $separatePageTypeToggle.each((index, item) => {
    const $item = $(item)
    const $separatePageTypeToggleSections = $item.closest('.vcv-no-title').nextAll()
    handleToggle($item, $separatePageTypeToggleSections)
  })
  $overrideToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $allSiteSection)
  })
  $separateToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $postTypesSections)
  })
  $separatePostTypeToggle.on('change', function () {
    const $this = $(this)
    const $separatePostTypeToggleSections = $this.closest('.vcv-no-title').nextAll()
    handleToggle($this, $separatePostTypeToggleSections)
  })
  $separatePageTypeToggle.on('change', function () {
    const $this = $(this)
    const $separatePageTypeToggleSections = $this.closest('.vcv-no-title').nextAll()
    handleToggle($this, $separatePageTypeToggleSections)
  })
}
