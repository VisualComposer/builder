import './parallax.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-parallax-mouse-move]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    window.vceAssetsParallaxMouseMove(selector);
  }
});