/* global vcv, $ */
vcv.ready(() => {

});
vcv.on('ready', () => {
  $('.vce-single-image-zoom-container:not(.vce-single-image-zoom-built)').zoom({
    callback: function () {
      this.parentNode.classList.add('vce-single-image-zoom-built');
    }
  });
});
