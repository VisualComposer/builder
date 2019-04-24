import './parallax.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    setTimeout(function() {
      var selector = '[data-vce-assets-parallax]';
      selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
      window.vceAssetsParallax(selector);
    }, 10)
  }
});