import './backgroundVideoYoutube.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-yt]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;
    window.vceAssetsBackgroundVideoYoutube(selector);
  }
});