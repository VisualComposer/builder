import './backgroundVideoVimeo.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-vimeo]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    window.vceAssetsBackgroundVideoVimeo(selector);
  }
});