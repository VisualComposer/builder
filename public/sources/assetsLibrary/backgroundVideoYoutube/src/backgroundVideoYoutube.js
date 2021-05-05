import './backgroundVideoYoutube.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    var selector = '[data-vce-assets-video-yt]';
    selector = id ? '[data-vcv-element="' + id + '"] ' + selector : selector;

    const isLazyElement = document.querySelector(`${selector} .vcv-lozad`);

    if (!isLazyElement) {
      window.vceAssetsBackgroundVideoYoutube(selector);
    }

  }
});