/* global vcv, $ */
vcv.on('ready', () => {

  var $googleMaps = $('.vce-google-maps-inner');
  var $googleMapsIframe = $googleMaps.find('iframe');

  $googleMaps.click(function () {
    $(this).find('iframe').css('pointer-events', 'auto');
  });

  $googleMaps.mouseleave(function () {
    $(this).find('iframe').css('pointer-events', 'none');
  });

  $googleMapsIframe.css('pointer-events', 'none');
});
