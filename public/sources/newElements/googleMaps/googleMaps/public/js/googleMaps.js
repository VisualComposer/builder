/* global vcv */
(function ($) {
  vcv.on('googleMapsReady', function () {
    var $googleMaps = $('.vce-google-maps-inner')
    var $googleMapsIframe = $googleMaps.find('iframe')

    $googleMaps.click(function () {
      $(this).find('iframe').css('pointer-events', 'auto')
    })

    $googleMaps.mouseleave(function () {
      $(this).find('iframe').css('pointer-events', 'none')
    })

    $googleMapsIframe.css('pointer-events', 'none')
  })

  vcv.on('ready', function () {
    $(function () {
      vcv.trigger('googleMapsReady')
    })
  })
})(window.jQuery)
