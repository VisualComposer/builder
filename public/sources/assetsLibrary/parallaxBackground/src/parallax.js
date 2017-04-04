window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-parallax]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    window.vceAssetsParallax(selector);
  }
});