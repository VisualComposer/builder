/* global vcv */
vcv.ready(() => {
  console && console.log('css animate public javascript called once')
})
vcv.on('ready', () => {
  console && console.log('css animate public javascript will be called everytime you need react on ready')
})
