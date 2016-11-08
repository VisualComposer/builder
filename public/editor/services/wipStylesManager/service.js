import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssClean from 'postcss-clean'
import postcssCustomProps from 'postcss-custom-properties'
import postcssAdvancedVars from 'postcss-advanced-variables'
import postcssColor from 'postcss-color-function'
import postcssNested from 'postcss-nested'
import postcssMedia from 'postcss-custom-media'

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

  compile (join = true) {
    let iterations = []
    this.get().forEach((style) => {
      let stylePromise = new Promise((resolve, reject) => {
        let use = []
        if (style.hasOwnProperty('variables')) {
          use.push(postcssAdvancedVars({
            variables: style.variables
          }))
          use.push(postcssCustomProps(style.variables))
        }
        if (style.hasOwnProperty('viewports')) {
          use.push(postcssMedia({
            extensions: style.viewports
          }))
        }

        use.push(postcssNested)
        use.push(postcssColor)
        use.push(postcssClean)

        postcss(use).process(style.src)
          .then((result) => {
            resolve(result.css)
          })
      })
      iterations.push(stylePromise)
    })

    if (join) {
      return Promise.all(iterations).then((output) => {
        return output.join(' ')
      })
    }
    return Promise.all(iterations)
  }
}
const service = {
  create (data) {
    return new StylesManager(data)
  }
}
vcCake.addService('wipStylesManager', service)
