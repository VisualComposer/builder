import vcCake from 'vc-cake'

class StylesManager {
  constructor (styles = []) {
    this.styles = styles
  }

  get () {
    return this.styles
  }

  add (styles) {
    this.styles = this.styles.concat(styles)
    return this
  }

  compile () {
    // let iterations = []
    // this.get().forEach((style) => {
      // console.log(style)
      // let stylePromise = new Promise((resolve, reject) => {
      //
      // })
    // })
  }
}
const service = {
  create (data) {
    return new StylesManager(data)
  }
}
vcCake.addService('wipStylesManager', service)
