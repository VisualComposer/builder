window.vcv.on('ready', function (action, id) {
  console.log('parallax ready', action)
  if (action !== 'merge') {
    var selector = '[data-vce-assets-parallax-fade]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    window.vceAssetsParallaxFade(selector);
  }
});