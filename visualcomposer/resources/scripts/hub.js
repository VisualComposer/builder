/*global _*/
(function ($) {
  var template = _.template($('#vcv-elements-template').html())
  var $hub = $('#vcv-hub-content')

  var headers = [
    {
      key: 'Authorization',
      value: 'Bearer ' + window.vcv_api.token,
      name: 'Authorization'
    },
    {
      key: 'Accept',
      value: 'application/vnd.vc.v1+json',
      name: 'Accept'
    }
  ]

  $hub.on('click', '[data-vcv-paging-url]', (e) => {
    let url = $(e.target).data('vcvPagingUrl')
    if (url) {
      loadPage(url)
    }
  })

  function loadPage (url) {
    $.ajax({
      type: 'GET',
      url: url,
      beforeSend: function (request) {
        for (var i = 0; i < headers.length; i++) {
          request.setRequestHeader(headers[ i ].name, headers[ i ].value)
        }
      },
      success: function (response) {
        var html = template({ items: response.data, pagination: response.meta.pagination })
        $hub.html(html)
      },
      fail: function (response) {
        console.log('failed', arguments)
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('error', arguments)
        window.alert('token expired/unauthorized')
      },
      always: function () {
        console.log('always', arguments)
      }
    })
  }

  loadPage(window.vcv_api.accountURL + '/api/elements')
})(window.jQuery)
