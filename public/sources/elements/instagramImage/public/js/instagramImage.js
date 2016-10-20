/* global vcv */
vcv.ready(() => {
  console && console.log('instagram image public javascript called once')
});
vcv.on('ready', () => {
  console && console.log('instagram image public javascript will be called everytime you need react on ready')
});
