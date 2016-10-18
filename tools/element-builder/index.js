'use strict'

var swig = require('swig')
var path = require('path')
var fs = require('fs')
const normalizeUrl = require('normalize-url')
const vcvSettings = require('../webpack-collector/lib/settings')
var args = []
var namedArgs = {}
// get named args
process.argv.slice(2).forEach(function (value) {
  if (value.indexOf('--') === 0) {
    var namedData = value.split('=')
    if (namedData.length !== 2) {
      console.error('Wrong named parameter')
      process.exit(1)
    }
    namedArgs[ namedData[ 0 ] ] = namedData[ 1 ]
  } else {
    args.push(value)
  }
})
var elementPath = args[ 0 ]
var elementDir = false
if (!elementPath || !(elementDir = path.resolve(process.cwd(), elementPath))) {
  console.error('Wrong element path')
  process.exit(1)
}

fs.lstat(elementDir, function (err, stats) {
  if (!err && stats.isDirectory()) {
    // Settings
    var settingsFile = path.resolve(elementDir, 'settings.json')
    var settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}'
    // Update all related attributes
    var settings = JSON.parse(settingsString)
    // generate settings tag
    settings.tag = {
      access: 'protected',
      type: 'string',
      value: namedArgs.hasOwnProperty('--uuid') ? namedArgs[ '--uuid' ] : generateUUID()
    }
    // check settings type name
    if (!settings.name.value) {
      console.error('Error, wrong name in settings')
      process.exit(1)
    }
    var componentTemplateFile = path.resolve(elementDir, 'component.js')
    var componentTemplate = ''
    if (fs.existsSync(componentTemplateFile)) {
      componentTemplate = fs.readFileSync(componentTemplateFile)
    } else {
      // create vars from settings
      var varNames = []
      var varData = {}
      for (var variable in settings) {
        if (settings[ variable ].hasOwnProperty('value') && settings[ variable ].access === 'public') {
          varNames.push(variable)
          varData[ variable ] = settings[ variable ].value
        }
      }
      var varString = varNames.join(', ')
      var variables = 'var {id, atts, editor} = this.props' + '\n'
      variables += 'var {' + varString + '} = atts' + '\n' + 'var content = this.props.children' + '\n'
      // prepare template scripts
      var javascriptFile = path.resolve(elementDir, 'scripts.js')
      var javascriptString = fs.existsSync(javascriptFile) ? fs.readFileSync(javascriptFile) : ''
      if (!javascriptString && javascriptString.length) {
        console.error('Error, wrong scripts.js file.')
        process.exit(1)
      }
      // JSX Component
      var templateFile = path.resolve(elementDir, 'template.jsx')
      var templateString = fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : ''
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

    // Css settings
    // file
    var cssFileName = 'styles.css'
    var cssFile = path.resolve(elementDir, cssFileName)
    var cssExists = fs.existsSync(cssFile)
    var cssString = cssExists ? fs.readFileSync(cssFile, 'utf8') : false
    var cssRelativeFile = ''
    if (namedArgs.hasOwnProperty('--add-css') && namedArgs[ '--add-css' ] === 'true' && cssExists) {
      cssRelativeFile = "require( './" + cssFileName + "' )"
    }

    // Settings
    var cssSettingsFile = path.resolve(elementDir, 'css.json')
    var cssSettingsString = fs.existsSync(cssSettingsFile) ? fs.readFileSync(cssSettingsFile, 'utf8') : '{}'
    var cssSettings = JSON.parse(cssSettingsString)
    cssSettings.css = cssString
    if (!cssSettings) {
      console.error('Error, wrong css settings')
      process.exit(1)
    }

    // Public javascript
    const collectPublicJsFile = function (contentPath, files, prefix) {
      fs.existsSync(contentPath) && fs.readdirSync(contentPath).forEach((file) => {
        let subPath = path.resolve(contentPath, file)
        if (fs.lstatSync(subPath).isDirectory()) {
          collectPublicJsFile(subPath, files, prefix + '/' + file)
        } else if (subPath.match(/\.js$/)) {
          files.push(prefix + '/' + file)
        }
      })
      return files
    }
    var publicJs = collectPublicJsFile(path.resolve(elementDir, 'public/js'), [], vcvSettings.elementsDirName + '/' + settings.tag.value + '/public/js')
    if (publicJs.length) {
      settings.metaPublicJs = {
        access: 'protected',
        type: 'string',
        value: publicJs
      }
    }
    var template = swig.renderFile(path.join(__dirname, 'template.jst'), {
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
      },
      editorJsSettings: function () {
        return 'null'
      }
    })
    if (namedArgs.hasOwnProperty('--root-url') && namedArgs[ '--root-url' ].length) {
      const rootUrl = normalizeUrl(namedArgs[ '--root-url' ] + '/public') + '/'
      template = template.toString().replace(/(("|'))\/?public\//g, '$1' + rootUrl)
    }
    if (namedArgs.hasOwnProperty('--output') && namedArgs[ '--output' ] === 'file') {
      fs.writeFileSync(path.join(elementDir, 'element.js'), template)
      process.exit(0)
    }
    process.stdout.write(template)
  } else {
    console.error('Directory "${elementDir}" does not exist!')
    process.exit(1)
  }
})

function generateUUID () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
