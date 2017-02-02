/* global vcv */
/* global vceAssetsParallax */
vcv.on('ready', (action, id) => {
  if (action !== 'reset') {
    var selector = `[data-vce-assets-parallax]`;
    selector = id ? `[data-vcv-element="${id}"] ${selector}` : selector;
    vceAssetsParallax( selector );
  }
})
