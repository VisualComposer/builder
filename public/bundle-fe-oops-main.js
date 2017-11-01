import './sources/less/wpfeoops/init.less'

(($) => {
  $(() => {
    let $backButton = $('[data-vcv-back]')
    $backButton.on('click', () => {
      window.location = $backButton.data('vcvBack')
    })
  })
})(window.jQuery)
