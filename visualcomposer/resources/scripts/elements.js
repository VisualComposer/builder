(function ($) {
  function initDefaultElements () {
    console.info('Downloading default elements. Please wait...')

    $.getJSON(window.ajaxurl, {
      _vcnonce: window.vcAdminNonce,
      action: 'vcv:initDefaultElements'
    }, function (response) {
      if (!response.status) {
        console.error(response.error)
        return
      }
      console.info(response.installed + ' elements were installed!')
    }).error(function () {
      console.error('Something went wrong')
    }).always(function () {
      $('#downloading-progress').remove()
    })
  }

  initDefaultElements()
})(window.jQuery)
