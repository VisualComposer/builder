/* global vcv */
/* global vceAssetsParallaxFade */
vcv.on('ready', (action, id) => {
  if (action !== 'merge') {
    var selector = `[data-vce-assets-parallax-fade]`;
    selector = id ? `[data-vcv-element="${id}"] ${selector}` : selector;
    vceAssetsParallaxFade( selector );
  }
})
