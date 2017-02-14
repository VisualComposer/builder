/* global vcv */
/* global vceAssetsBackgroundVideoYoutube */
vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-yt]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    vceAssetsBackgroundVideoYoutube(selector);
  }
})
