(() => {
  window.vcv.on('ready', () => {
    setTimeout(() => {
      window.vceResetFullWidthRows()
    }, 10)
    window.vceResetFullHeightRows()
  })
})()
