import swig from 'swig'
import path from 'path'
import fs from 'fs'
import normalizeUrl from 'normalize-url'
import options from '../settings'

let Builder = () => {}

Builder.prototype.getSettings = function (elementDir, data) {
  // Settings
  let settingsFile = path.resolve(elementDir, 'settings.json')
  let settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}'
  // Update all related attributes
  let settings = JSON.parse(settingsString)
  if (!settings || !settings.name) {
    return false
  }
  // generate settings tag
  settings.tag = {
    access: 'protected',
    type: 'string',
    value: data.hasOwnProperty('--uuid') ? data[ '--uuid' ] : generateUUID()
  }
  // check settings type name
  if (!settings.name.value) {
    console.error('Error, wrong name in settings')
    process.exit(1)
  }
  return settings
}

Builder.prototype.getTemplate = function (elementDir, settings) {
  let componentTemplateFile = path.resolve(elementDir, 'component.js')
  let componentTemplate = ''
  if (fs.existsSync(componentTemplateFile)) {
    componentTemplate = fs.readFileSync(componentTemplateFile)
  } else {
    // create vars from settings
    let varNames = []
    let varData = {}
    for (let variable in settings) {
      if (settings.hasOwnProperty(variable) && settings[ variable ].hasOwnProperty('value') && settings[ variable ].access === 'public') {
        varNames.push(variable)
        varData[ variable ] = settings[ variable ].value
      }
    }
    let varString = varNames.join(', ')
    let variables = 'let {id, atts, editor} = this.props' + '\n'
    variables += 'let {' + varString + '} = atts' + '\n' + 'let content = this.props.children' + '\n'
    // prepare template scripts
    let javascriptFile = path.resolve(elementDir, 'scripts.js')
    let javascriptString = fs.existsSync(javascriptFile) ? fs.readFileSync(javascriptFile) : ''
    if (!javascriptString && javascriptString.length) {
      console.error('Error, wrong scripts.js file.')
      process.exit(1)
    }
    // JSX Component
    let templateFile = path.resolve(elementDir, 'template.jsx')
    let templateString = fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : ''
    if (!templateString && templateString.length) {
      console.error('Error, wrong Template.jsx file.')
      process.exit(1)
    }
    // put editor variables in end of string
    templateString = templateString.replace(/(\/>|>)/i, ' {...editor}$1')
    componentTemplate = swig.renderFile(path.join(__dirname, 'elementComponent.jst'), {
      variables: function () {
        return variables
      },
      templateJs: function () {
        return javascriptString
      },
      template: function () {
        return templateString
      }
    })
  }
  return componentTemplate
}

Builder.prototype.getCssFile = function (elementDir) {
  let cssFileName = 'styles.css'
  let cssFile = path.resolve(elementDir, cssFileName)
  let cssExists = fs.existsSync(cssFile)
  let cssString = cssExists ? fs.readFileSync(cssFile, 'utf8') : false

  return {
    cssString: cssString,
    cssFileName: cssFileName,
    cssExists: cssExists
  }
}

Builder.prototype.getEditorCssFile = function (elementDir) {
  let editorCssFileName = 'editor.css'
  let editorCssFile = path.resolve(elementDir, editorCssFileName)
  let editorCssExists = fs.existsSync(editorCssFile)
  let editorCssString = editorCssExists ? fs.readFileSync(editorCssFile, 'utf8') : false

  return {
    editorCssString: editorCssString,
    editorCssFileName: editorCssFileName,
    editorCssExists: editorCssExists
  }
}

Builder.prototype.collectPublicJsFile = function (contentPath, files, prefix) {
  fs.existsSync(contentPath) && fs.readdirSync(contentPath).forEach((file) => {
    let subPath = path.resolve(contentPath, file)
    if (fs.lstatSync(subPath).isDirectory()) {
      this.collectPublicJsFile(subPath, files, prefix + '/' + file)
    } else if (subPath.match(/\.js$/)) {
      files.push(prefix + '/' + file)
    }
  })
  return files
}

Builder.prototype.buildTemplate = function (settings, componentTemplate, cssRelativeFile, cssSettings, data) {
  let template = swig.renderFile(path.join(__dirname, 'template.jst'), {
    settings: function () {
      return JSON.stringify(settings)
    },
    elementComponent: function () {
      return componentTemplate
    },
    jsCallback: function () {
      return "''"
    },
    cssFile: function () {
      return cssRelativeFile + ''
    },
    cssSettings: function () {
      return JSON.stringify(cssSettings) + ''
    }
  })
  if (data.hasOwnProperty('--root-url') && data[ '--root-url' ].length) {
    const rootUrl = normalizeUrl(data[ '--root-url' ] + '/public') + '/'
    template = template.toString().replace(/(("|'))\/?public\//g, '$1' + rootUrl)
  }
  return template
}

Builder.prototype.generateOutput = function (elementDir, data) {
  if (fs.lstatSync(elementDir).isDirectory()) {
    let settings = this.getSettings(elementDir, data)
    if (!settings) {
      return false
    }
    let componentTemplate = this.getTemplate(elementDir, settings)
    // Css settings
    let cssRelativeFile = ''
    let { cssString, cssFileName, cssExists } = this.getCssFile(elementDir)
    if (data.hasOwnProperty('--add-css') && data[ '--add-css' ] === 'true' && cssExists) {
      cssRelativeFile = `import './${cssFileName}'`
    }
    let { editorCssString } = this.getEditorCssFile(elementDir)

    // mixins
    let mixinsDirName = 'cssMixins'
    let mixinsDir = path.resolve(elementDir, mixinsDirName)
    let cssMixins = {}
    fs.existsSync(mixinsDir) && fs.readdirSync(mixinsDir).forEach((file) => {
      let filePath = path.resolve(mixinsDir, file)
      // let subPath = path.resolve(mixinsDir, file)
      if (!fs.lstatSync(filePath).isDirectory()) {
        cssMixins[ path.basename(filePath, path.extname(filePath)) ] = {
          mixin: fs.readFileSync(filePath, 'utf8')
        }
      }
    })

    // Settings
    let cssSettings = {}
    // file
    cssSettings.css = cssString
    cssSettings.editorCss = editorCssString

    // mixins
    if (Object.keys(cssMixins).length) {
      cssSettings.mixins = cssMixins
    }
    if (!cssSettings) {
      console.error('Error, wrong css settings')
      process.exit(1)
    }

    // Public javascript

    let publicJs = this.collectPublicJsFile(path.resolve(elementDir, 'public/js'), [], options.elementsDirName + '/' + settings.tag.value + '/public/js')
    if (publicJs.length) {
      settings.metaPublicJs = {
        access: 'protected',
        type: 'string',
        value: publicJs
      }
    }

    return this.buildTemplate(settings, componentTemplate, cssRelativeFile, cssSettings, data)
  }
  return false
}

function generateUUID () {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

module.exports = new Builder()
