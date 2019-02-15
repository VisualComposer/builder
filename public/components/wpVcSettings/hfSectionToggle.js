const $ = window.jQuery
const $overrideToggle = $('input[value="headers-footers-override"]')
const $separateToggle = $('input[value="headers-footers-separate"]')
const $separatePostToggle = $('input[value="headers-footers-separate-post"]')
const $separatePageToggle = $('input[value="headers-footers-separate-page"]')
const $allSiteSection = $overrideToggle.closest('.form-table').next('.vcv-child-section')
const $postTypesSections = $separateToggle.closest('.vcv-headers-footers-section').nextAll()
const $separatePostToggleSections = $separatePostToggle.closest('.vcv-no-title').nextAll()
const $separatePageToggleSections = $separatePageToggle.closest('.vcv-no-title').nextAll()
const $toggleCells = $('.vcv-no-title td')

const handleToggle = ($this, $target) => {
  if ($this[0].checked) {
    $target.show()
  } else {
    $target.hide()
  }
}

export const hfSectionToggle = () => {
  console.log('test')
  $toggleCells.attr('colspan', '2')
  handleToggle($overrideToggle, $allSiteSection)
  handleToggle($separateToggle, $postTypesSections)
  handleToggle($separatePostToggle, $separatePostToggleSections)
  handleToggle($separatePageToggle, $separatePageToggleSections)
  $overrideToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $allSiteSection)
  })
  $separateToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $postTypesSections)
  })
  $separatePostToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $separatePostToggleSections)
  })
  $separatePageToggle.on('change', function () {
    const $this = $(this)
    handleToggle($this, $separatePageToggleSections)
  })
}
