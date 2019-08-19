/* eslint-disable no-eval */
import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssClean from 'postcss-clean'
import postcssCustomProps from 'postcss-custom-properties'
import postcssAdvancedVars from 'postcss-advanced-variables'
import postcssColor from 'postcss-color-function'
import postcssNested from 'postcss-nested'
import postcssPrefixUrl from 'postcss-prefix-url'
import postcssMedia from 'postcss-custom-media'
import postcssEach from 'postcss-each'
import colorBlend from 'color-blend'
import functions from 'postcss-functions'
import autoprefixer from 'autoprefixer'
import objectHash from 'node-object-hash'

let cssHashes = {}
let mainPlugins = []
mainPlugins.push(postcssEach)
mainPlugins.push(colorBlend())
let plugin = postcss.plugin('postcss-math', () => {
  return (css) => {
    // Transform CSS AST here
    css.walk((node) => {
      let nodeProp

      if (node.type === 'decl') {
        nodeProp = 'value'
      } else if (node.type === 'atrule' && node.name === 'media') {
        nodeProp = 'params'
      } else if (node.type === 'rule') {
        nodeProp = 'selector'
      } else {
        return
      }

      let match = 'resolve('
      if (!node[ nodeProp ] || node[ nodeProp ].indexOf(match) === -1) {
        return
      }
      let temp = node[ nodeProp ].replace(/([^)]+)$/, '')
      let newValue = window.eval('var resolve=function(s) { return window.eval(s)+\'\'; }; ' + temp) + ''
      node[ nodeProp ] = node[ nodeProp ].replace(temp, newValue)
    })
  }
})
mainPlugins.push(plugin())

// mainPlugins.push(postcssMath())
mainPlugins.push(functions({
  functions: {
    rawUrl: (path) => {
      return `url(${path})`
    }
  }
}))
mainPlugins.push(postcssColor)
mainPlugins.push(postcssNested)
mainPlugins.push(postcssClean)
mainPlugins.push(autoprefixer({
  overrideBrowserslist: [ 'ie >= 11', 'last 2 version' ]
}))

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

  getViewports () {
    let devices = [
      {
        prefixes: [ `all` ],
        min: null,
        max: null
      },
      {
        prefixes: [ `xs`, `mobile-portrait` ],
        min: null,
        max: '543px' // mobile-landscape.min - 1
      },
      {
        prefixes: [ `sm`, `mobile-landscape` ],
        min: '544px',
        max: '767px' // tablet-portrait.min - 1
      },
      {
        prefixes: [ `md`, `tablet-portrait` ],
        min: '768px',
        max: '991px' // tablet-landscape.min - 1
      },
      {
        prefixes: [ `lg`, `tablet-landscape` ],
        min: '992px',
        max: '1199px' // desktop.min - 1
      },
      {
        prefixes: [ `xl`, `desktop` ],
        min: '1200px',
        max: null
      }
    ]

    let viewports = {}
    devices.forEach((device) => {
      device.prefixes.forEach((prefix) => {
        let queries = [ 'all' ]
        // mobile-first queries
        if (device.min) {
          queries.push(`(min-width: ${device.min})`)
        }
        viewports[ `--${prefix}` ] = queries.join(' and ')
        // viewport specific queries
        if (device.max) {
          queries.push(`(max-width: ${device.max})`)
        }
        viewports[ `--${prefix}-only` ] = queries.join(' and ')
      })
    })
    return viewports
  }

  compile (join = true) {
    let iterations = []
    this.get().forEach((style) => {
      let hasher = objectHash({ sort: true, coerce: true }).hash
      let hash = hasher(style)

      if (typeof cssHashes[ hash ] !== 'undefined' && typeof cssHashes[ hash ].result !== 'undefined') {
        return iterations.push(cssHashes[ hash ].result)
      }

      let use = []
      if (style.hasOwnProperty('variables')) {
        use.push(postcssAdvancedVars({
          variables: style.variables
        }))
        use.push(postcssCustomProps(style.variables))
      } else {
        use.push(postcssAdvancedVars())
        use.push(postcssCustomProps())
      }
      cssHashes[ hash ] = {}

      let viewports = this.getViewports()
      if (style.hasOwnProperty('viewports')) {
        viewports = style.viewports
      }
      use.push(postcssMedia({
        importFrom: { customMedia: viewports }
      }))

      if (style.path) {
        use.push(postcssPrefixUrl({
          useUrl: true,
          prefix: style.path
        }))
      }
      use = use.concat(mainPlugins)
      return iterations.push(postcss(use).process(style.src, { from: undefined }).then((result) => {
        let resultCss = result && result.css ? result.css : ''
        cssHashes[ hash ].result = resultCss
        return resultCss
      }).catch((result) => {
        window.console && window.console.warn && window.console.warn('Failed to compile css', style, result)
      }))
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
vcCake.addService('stylesManager', service)
