/* global vcvAPI */
vcvAPI.ready(() => {
  console && console.log('single image public javascript called once')
})
vcvAPI.on('ready', () => {
  console && console.log('single image public javascript will be called everytime you need react on ready')
})
