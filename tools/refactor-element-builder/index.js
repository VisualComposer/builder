'use strict'

let swig = require('swig')
let config = require('./settings')
let path = require('path')
let fs = require('fs')

let getElements = () => {
  let elementPath = path.join(config.publicDir, config.elementsPath)
  console.log(elementPath)
  let files = fs.readdirSync(elementPath)
  let elements = []
  files.forEach((element) => {
    let filePath = path.join(elementPath, element)
    let stats = fs.lstatSync(filePath)
    let isDirectory = stats.isDirectory()
    if (isDirectory && element[ 0 ] !== '_') {
      elements.push(element)
    }
  })

  return elements
}

let collectPublicJsFile = (contentPath, files, prefix) => {
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

let outputPhpElementSettings = (settings, element) => {
  let thumbnailImage = settings.metaThumbnail && settings.metaThumbnail.value ? `'metaThumbnailUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                  'public/sources/newElements/${element}/${element}/public/${settings.metaThumbnail.value}'
                ),` : ''
  let previewImage = settings.metaPreview && settings.metaPreview.value ? `'metaPreviewUrl' => $urlHelper->to(
                // @codingStandardsIgnoreLine
                    'public/sources/newElements/${element}/${element}/public/${settings.metaPreview.value}'
                ),` : ''
  console.log(
    `
        '${element}' => [
            'bundlePath' => $urlHelper->to(
                'public/sources/newElements/${element}/public/dist/element.bundle.js'
            ),
            'elementPath' => $urlHelper->to(
                'public/sources/newElements/${element}/${element}/'
            ),
            'assetsPath' => $urlHelper->to(
                'public/sources/newElements/${element}/${element}/public/'
            ),
            'settings' => [
                'name' => '${settings.name.value}',
                ${thumbnailImage}
                ${previewImage}
                'metaDescription' => '${settings.metaDescription ? settings.metaDescription.value : ''}',
            ],
        ],
    `
  )
}
let updateSettings = (settings, element) => {
  // generate settings tag
  settings.tag = {
    access: 'protected',
    type: 'string',
    value: element
  }
  // Public javascript
  let publicJs = collectPublicJsFile(path.resolve(config.elementsDirName + '/' + element + '/public/js'), [], config.elementsDirName + '/' + element + '/public/js')
  if (publicJs.length) {
    settings.metaPublicJs = {
      access: 'protected',
      type: 'string',
      value: publicJs
    }
  }

  // Remove unneeded
  delete settings.name
  delete settings.metaIntro
  delete settings.metaDescription
  delete settings.metaPreviewDescription
  delete settings.metaPreview
  delete settings.metaThumbnail

  return settings
}

let getCssSettings = (elementDirectory) => {
  // Css settings
  let cssFile = path.resolve(elementDirectory, 'styles.css')
  let cssRelativeFile = fs.existsSync(cssFile) ? "require( 'raw-loader!./styles.css' )" : false
  // editor file
  let editorCssFile = path.resolve(elementDirectory, 'editor.css')
  let editorCssString = fs.existsSync(editorCssFile) ? "require( 'raw-loader!./styles.css' )" : false

  // mixins
  let mixinsDir = path.resolve(elementDirectory, 'cssMixins')
  let cssMixins = {}
  fs.existsSync(mixinsDir) && fs.readdirSync(mixinsDir).forEach((file) => {
    let filePath = path.resolve(mixinsDir, file)
    if (!fs.lstatSync(filePath).isDirectory()) {
      cssMixins[ path.basename(filePath, path.extname(filePath)) ] = {
        mixin: `require(raw-loader!./cssMixins/${file})` // fs.readFileSync(filePath, 'utf8')
      }
    }
  })

  // Settings
  let cssSettings = {}
  // file
  cssSettings.css = cssRelativeFile
  cssSettings.editorCss = editorCssString
  // mixins
  if (Object.keys(cssMixins).length) {
    cssSettings.mixins = cssMixins
  }

  return cssSettings
}

let renderTemplate = (data) => {
  let compiledTemplate = swig.renderFile(path.join(__dirname, 'index-template.jst'), data)
  compiledTemplate = compiledTemplate.replace(/"require\((.[^\)]*)\)"/g, ' require($1)')

  return compiledTemplate
}

let processElement = (element, elementDirectory) => {
  console.log('============================')
  console.log('Element: ', element)
  let settingsFile = path.resolve(elementDirectory, 'settings.json')
  let settingsString = fs.existsSync(settingsFile) ? fs.readFileSync(settingsFile) : '{}'
  // Update all related attributes
  let settings = JSON.parse(settingsString)
  let elementComponentName = element.charAt(0).toUpperCase() + element.slice(1)
  // Update Settings
  outputPhpElementSettings(settings, element)
  settings = updateSettings(settings, element)
  console.log('=====   NEW SETTINGS   =====')
  console.log(JSON.stringify(settings))
  let cssSettings = getCssSettings(elementDirectory)
  console.log('====      TEMPLATE      ====')
  let template = renderTemplate({
    cssSettings: () => {
      return JSON.stringify(cssSettings)
    },
    elementComponentName: () => {
      // Ucfirst
      return elementComponentName
    }
  })

  console.log(template)
  console.log('=============================')
  let componentTemplateFile = path.resolve(elementDirectory, 'component.js')
  let componentTemplate = ''
  if (fs.existsSync(componentTemplateFile)) {
    componentTemplate = fs.readFileSync(componentTemplateFile).toString()
  }

  let componentHead = `import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class ${elementComponentName} extends `
  let newComponentTemplate = componentHead + componentTemplate.substring(componentTemplate.indexOf('vcvAPI.elementComponent'))
  console.log(newComponentTemplate)
  return {
    indexTemplate: template,
    settings: settings
  }
}

let createNewFiles = (data, element, elementDirectory, newElementDirectory) => {
  console.log('Save new files', element, newElementDirectory)
  console.log('====================')
}

let elements = getElements()
elements.forEach((element) => {
  console.log('####################')
  let elementDirectory = path.join(config.publicDir, config.elementsPath, element)
  let newElementDirectory = path.join(config.publicDir, config.newElementsPath, element)
  let isNewElementsDirectoryExists = fs.existsSync(newElementDirectory)
  if (isNewElementsDirectoryExists) {
    console.log('Skip already migrated element', element)
  } else {
    console.log('Migrate old element', element)
    fs.lstat(elementDirectory, (err, stats) => {
      if (!err && stats.isDirectory()) {
        let processedElementData = processElement(element, elementDirectory)
        createNewFiles(processedElementData, element, elementDirectory, newElementDirectory)
      }
    })
  }
  console.log('####################')
})
