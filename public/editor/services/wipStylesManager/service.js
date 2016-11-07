import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssClean from 'postcss-clean'
import postcssCustomProps from 'postcss-custom-properties'
import postcssAdvancedVars from 'postcss-advanced-variables'
import postcssColor from 'postcss-color-function'
import postcssNested from 'postcss-nested'

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
    let iterations = []
    this.get().forEach((style) => {
      console.log(style)
      if (!style.hasOwnProperty('variables')) {
        style.variables = {}
      }
      let stylePromise = new Promise((resolve, reject) => {
        postcss()
          .use(postcssAdvancedVars({
            variables: style.variables
          }))
          .use(postcssCustomProps(style.variables))
          .use(postcssNested)
          .use(postcssColor)
          .use(postcssClean)
          .process(style.src)
          .then((result) => {
            resolve(result.css)
          })
      })
      iterations.push(stylePromise)
    })
    return Promise.all(iterations).then((output) => {
      return output.join(' ')
    })
  }
}
const service = {
  create (data) {
    return new StylesManager(data)
  }
}
vcCake.addService('wipStylesManager', service)
