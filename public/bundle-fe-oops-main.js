import './sources/less/wpfeoops/init.less'

(($) => {
  $(() => {
    let $retryButton = $('[data-vcv-back]')
    $retryButton.on('click', () => {
      window.location = $retryButton.data('vcvBack')
    })
  })
})(window.jQuery)
