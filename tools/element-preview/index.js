var swig = require('swig')
var path = require('path')
var fs = require('fs')
var React = require('react')
var ReactDom = require('react-dom/server')
require('node-jsx').install({ extension: '.jsx' })

var args = process.argv.slice(2)
var elementPath = args[ 0 ]
var elementDir = false
if (!elementPath || !(elementDir = path.resolve(process.cwd(), elementPath))) {
  console.error('Wrong element path')
  process.exit(1)
}

fs.lstat(elementDir, function (err, stats) {
  'use strict'
  if (!err && stats.isDirectory()) {
    // Settings
    var settingsFile = path.resolve(elementDir, 'settings.json')
    var settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}'
    var settings = JSON.parse(settingsString)
    if (!settings.tag || !settings.tag.value) {
      console.error('Error, wrong tag in settings')
      process.exit(1)
    }
    if (!settings.name.value) {
      console.error('Error, wrong name in settings')
      process.exit(1)
    }
    // create vars from settings
    var varNames = []
    var varData = {}
    for (let variable in settings) {
      if (settings[ variable ].hasOwnProperty('value')) {
        varNames.push(variable)
        varData[ variable ] = settings[ variable ].value
      }
    }
    var variables = 'let {' + varNames.join(', ') + ', id} = this.props'
    // prepare template scripts
    var javascriptFile = path.resolve(elementDir, 'scripts.js')
    var javascriptString = fs.existsSync(javascriptFile) ? fs.readFileSync(javascriptFile) : ''
    if (!javascriptString && javascriptString.length) {
      console.error('Error, wrong scripts.js file.')
      process.exit(1)
    }
    // Css settings
    var cssFileName = 'styles.css'
    var cssFile = path.resolve(elementDir, cssFileName)
    var cssExists = fs.existsSync(cssFile)
    var cssRelativeFile = ''
    if (cssExists) {
      cssRelativeFile = '<link rel="stylesheet" href="' + cssFileName + '">'
    }

    // JSX Component
    var templateFile = path.resolve(elementDir, 'template.jsx')
    var templateString = fs.existsSync(templateFile) ? fs.readFileSync(templateFile, 'utf8') : ''
    if (!templateString && templateString.length) {
      console.error('Error, wrong template.jsx file.')
      process.exit(1)
    }
    let componentTemplateFile = path.join(__dirname, 'template.js.tpl')
    let componentTemplate = swig.renderFile(componentTemplateFile, {
      variables: function () {
        return variables
      },
      templateJs: function () {
        return javascriptString
      },
      template: function () {
        templateString = templateString.replace('{...other}', '')
        return templateString
      }
    })
    var componentFilePath = path.join(elementDir, 'previewComponent.jsx')
    fs.writeFileSync(componentFilePath, componentTemplate)
    // Render element
    let Component = require(componentFilePath)
    let ComponentElement = React.createElement(Component, varData)
    // get html template
    let htmlTemplateFile = path.join(__dirname, 'template.html.tpl')
    let htmlTemplate = swig.renderFile(htmlTemplateFile, {
      cssFile: function () {
        return cssRelativeFile + ''
      },
      renderedElement: function () {
        return ReactDom.renderToStaticMarkup(ComponentElement)
      }
    })
    // write preview to file
    var previewFilePath = path.join(elementDir, 'preview.html')
    fs.writeFileSync(previewFilePath, htmlTemplate)
    // remove unnecessary temp file
    fs.unlink(componentFilePath)
  } else {
    console.error('Directory "${elementDir}" does not exist!')
    process.exit(1)
  }
})
