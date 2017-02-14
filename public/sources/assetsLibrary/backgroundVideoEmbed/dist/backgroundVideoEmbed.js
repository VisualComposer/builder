/* global vcv */
/* global vceAssetsBackgroundVideoEmbed */
vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-embed]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    vceAssetsBackgroundVideoEmbed(selector);
  }
})
