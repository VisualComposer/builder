import vcCake from 'vc-cake'
class StylesManager {
  checkIt () {
    console.log('it works')
    return 'matrix has you...'
  }
}
const service = {
  create (data) {
    return new StylesManager(data)
  }
}
vcCake.addService('wipStylesManager', service)
