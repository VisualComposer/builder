/* eslint-disable no-eval */
import vcCake from 'vc-cake'
import postcss from 'postcss'
import postcssCustomProps from 'postcss-custom-properties'
import postcssAdvancedVars from 'postcss-advanced-variables'
import postcssColor from 'postcss-color-function'
import postcssNested from 'postcss-nested'
import postcssPrefixUrl from 'postcss-prefix-url'
import postcssMedia from 'postcss-custom-media'
import postcssEach from 'postcss-each'
import colorBlend from 'color-blend'
import functions from 'postcss-functions'
import objectHash from 'node-object-hash'

import cssNano from 'cssnano'

const cssHashes = {}
const mainPlugins = []
mainPlugins.push(postcssEach)
mainPlugins.push(colorBlend())
mainPlugins.push(cssNano({
  preset: 'default'
}))
const plugin = postcss.plugin('postcss-math', () => {
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

      const match = 'resolve('
      if (!node[nodeProp] || node[nodeProp].indexOf(match) === -1) {
        return
      }
      const temp = node[nodeProp].replace(/([^)]+)$/, '')
      const newValue = window.eval('var resolve=function(s) { return window.eval(s)+\'\'; }; ' + temp) + ''
      node[nodeProp] = node[nodeProp].replace(temp, newValue)
    })
  }
})
mainPlugins.push(plugin())

mainPlugins.push(functions({
  functions: {
    rawUrl: (path) => {
      return `url(${path})`
    }
  }
}))
mainPlugins.push(postcssColor)
mainPlugins.push(postcssNested)

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
    const devices = [
      {
        prefixes: ['all'],
        min: null,
        max: null
      },
      {
        prefixes: ['xs', 'mobile-portrait'],
        min: null,
        max: '543px' // mobile-landscape.min - 1
      },
      {
        prefixes: ['sm', 'mobile-landscape'],
        min: '544px',
        max: '767px' // tablet-portrait.min - 1
      },
      {
        prefixes: ['md', 'tablet-portrait'],
        min: '768px',
        max: '991px' // tablet-landscape.min - 1
      },
      {
        prefixes: ['lg', 'tablet-landscape'],
        min: '992px',
        max: '1199px' // desktop.min - 1
      },
      {
        prefixes: ['xl', 'desktop'],
        min: '1200px',
        max: null
      }
    ]

    const viewports = {}
    devices.forEach((device) => {
      device.prefixes.forEach((prefix) => {
        const queries = ['all']
        // mobile-first queries
        if (device.min) {
          queries.push(`(min-width: ${device.min})`)
        }
        viewports[`--${prefix}`] = queries.join(' and ')
        // viewport specific queries
        if (device.max) {
          queries.push(`(max-width: ${device.max})`)
        }
        viewports[`--${prefix}-only`] = queries.join(' and ')
      })
    })
    return viewports
  }

  compile (join = true) {
    const iterations = []
    this.get().forEach((style) => {
      const hasher = objectHash({ sort: true, coerce: true }).hash
      const hash = hasher(style)

      if (typeof cssHashes[hash] !== 'undefined' && typeof cssHashes[hash].result !== 'undefined') {
        return iterations.push(cssHashes[hash].result)
      }

      // No PostCSS used in local/global css
      if (style.pureCss) {
        window.setTimeout(() => {
          return style.src
        }, 0)
      }

      let use = []
      if (Object.prototype.hasOwnProperty.call(style, 'variables')) {
        use.push(postcssAdvancedVars({
          variables: style.variables,
          importRoot: '/'
        }))
        use.push(postcssCustomProps(style.variables))
      } else {
        use.push(postcssCustomProps())
      }
      cssHashes[hash] = {}

      let viewports = this.getViewports()
      if (Object.prototype.hasOwnProperty.call(style, 'viewports')) {
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
      if (typeof style.src !== 'string') {
        console.error('style.src is not string!', style.src)
        console.error('Possibly related to raw-loader update')
        console.error('Attempting to convert to string')
        if (style.src && typeof style.src.default === 'string') {
          style.src = style.src.default
        }
      }

      try {
        return iterations.push(postcss(use).process(style.src, { from: undefined }).then((result) => {
          const resultCss = result && result.css ? result.css : ''
          cssHashes[hash].result = resultCss
          return resultCss
        }).catch((result) => {
          window.console && window.console.warn && window.console.warn('Failed to compile css', style, result)
        }))
      } catch (e) {
        console.error(e)
        return ''
      }
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
