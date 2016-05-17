/*global _*/
(function ($) {
  var headers = [
    {
      key: 'Authorization',
      value: 'Bearer ' + window.vcv_api.token,
      name: 'Authorization'
    },
    {
      'key': 'Accept',
      'value': 'application/vnd.vc.v1+json',
      'name': 'Accept'
    }
  ]
  var template = _.template($('#vcv-elements-template').html())
  var $hub = $('#vcv-hub-content')
  $(function () {
    $.ajax({
      type: 'GET',
      beforeSend: function (request) {
        for (var i = 0; i < headers.length; i++) {
          request.setRequestHeader(headers[ i ].name, headers[ i ].value)
        }
      },
      url: 'http://test.account.visualcomposer.io/api/elements',
      success: function (response) {
        var html = template({ items: response.data })
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
  })
})(window.jQuery)
