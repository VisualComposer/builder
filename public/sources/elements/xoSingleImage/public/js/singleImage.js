/* global vcv, $ */
vcv.ready(() => {
  // console && console.log('single image public javascript called once')
});
vcv.on('ready', () => {
  // console && console.log('single image public javascript will be called everytime you need react on ready')
  $('.vcv-single-image-zoom-container:not(.vcv-single-image-zoom-built)').zoom({
    callback: function () {
      this.parentNode.classList.add('vcv-single-image-zoom-built');
    }
  });
});
