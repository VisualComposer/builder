/**
 * Based on BFHSelectBox
 * Modified by Visual Composer and optimized for tinymce
 * https://bootstrapformhelpers.com/select/
 */
const initializeJqueryPlugin = function (window) {
  const $ = window.jQuery
  if (window.vcvTinymcePluginInitialized) {
    return
  }
  window.vcvTinymcePluginInitialized = true
  const toggleSelector = '[data-toggle=vcv-ui-tinymce-fonts-selectbox]'

  const clearMenus = function ($el) {
    if ($el) {
      $el.closest('.vcv-ui-tinymce-fonts-selectbox').removeClass('mce-active')
    } else {
      $('.vcv-ui-tinymce-fonts-selectbox').removeClass('mce-active')
    }
    document.body.removeEventListener('click', closeIfNotInside)
  }

  const closeIfNotInside = function (e) {
    e && e.preventDefault()
    let $el = $(e.target)

    let $dropDown = '.vcv-ui-tinymce-fonts-selectbox-options'
    let mainWrapper = '.vcv-ui-tinymce-fonts-selectbox'
    let container = $el.closest($dropDown) || $el.closest(mainWrapper)

    if (container && container.length) {
      return
    }

    clearMenus()
  }

  const toggle = function (e) {
    e && e.preventDefault()
    const $el = $(this)

    if ($el.is('.disabled, :disabled')) {
      return false
    }

    const $parent = $el.closest('.vcv-ui-tinymce-fonts-selectbox')
    const isActive = $parent.hasClass('mce-active')
    clearMenus($el)

    if (!isActive) {
      $parent.toggleClass('mce-active')
      let inputValue = $parent.find('.vcv-ui-tinymce-fonts-selectbox-font-family').val()
      if (inputValue) {
        let parsed = JSON.parse(inputValue)
        $parent.find('[role=option] > li > [data-option*="' + (parsed.value || parsed.family) + '"]').focus()
      }

      // positioning
      const $editForm = $parent.closest('.vcv-ui-tree-content')
      if ($editForm.length) {
        const leftOffset = $parent.offset().left
        const editFormOffset = $editForm.offset().left
        const editFormWidth = $editForm.width()
        const $dropdownOptions = $parent.find('.vcv-ui-tinymce-fonts-selectbox-options')
        const width = $dropdownOptions.width()
        if ((leftOffset + width) > (editFormOffset + editFormWidth)) {
          // need to move font dropdown a bit to left side
          $dropdownOptions.css('left', ((editFormOffset + editFormWidth) - (leftOffset + width) - 10) + 'px')
        } else {
          $dropdownOptions.css('left', 0)
        }
      }
    }

    if (!isActive) {
      // this means it will be active now
      document.body.addEventListener('click', closeIfNotInside)
    } else {
      // this means popup is closed
      document.body.removeEventListener('click', closeIfNotInside)
    }

    return false
  }

  const filter = function () {
    const $el = $(this)
    const $parent = $el.closest('.vcv-ui-tinymce-fonts-selectbox')
    const $items = $('[role=option] li', $parent)
    $items.hide()

    $items.filter(function () { return ($(this).text().toUpperCase().indexOf($el.val().toUpperCase()) !== -1) }).show()
  }

  const select = function (e) {
    const $el = $(this)
    e.preventDefault()
    e.stopPropagation()

    if ($el.is('.disabled, :disabled')) {
      return false
    }

    const $parent = $el.closest('.vcv-ui-tinymce-fonts-selectbox')
    const $toggle = $parent.find('.vcv-ui-tinymce-fonts-selectbox-label')
    const $input = $parent.find('.vcv-ui-tinymce-fonts-selectbox-font-family')
    $toggle.html($el.html())

    $input.removeData()
    $input.val(JSON.stringify($el.data('option')))
    $.each($el.data(), function (i, e) {
      $input.data(i, e)
    })
    $input.trigger('change')
    clearMenus($el)
  }

  $('body')
    .on('click.vcvuitinymcefontsselectbox.data-api touchstart.vcvuitinymcefontsselectbox.data-api', '.vcv-ui-tinymce-fonts-selectbox ' + toggleSelector, toggle)
    .on('click.vcvuitinymcefontsselectbox.data-api', '.vcv-ui-tinymce-fonts-selectbox [role=option] > li > a', select)
    .on('propertychange.vcvuitinymcefontsselectbox.data-api change.vcvuitinymcefontsselectbox.data-api input.vcvuitinymcefontsselectbox.data-api paste.vcvuitinymcefontsselectbox.data-api', '.vcv-ui-tinymce-fonts-selectbox-filter', filter)
}

export default initializeJqueryPlugin
