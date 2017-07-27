/* global process, console */
const fs = require('fs-extra')
const path = require('path')
const UpdateEditorBundleBuilder = require('../lib/updateEditorBundleBuilder')
const UpdatePredefinedTemplatesBundleBuilder = require('../lib/updatePredefinedTemplatesBundleBuilder')
const UpdateCategoriesBundleBuilder = require('../lib/updateCategoriesBundleBuilder')
const UpdateAssetsLibrariesBundleBuilder = require('../lib/updateAssetsLibrariesBundleBuilder')
const UpdateElementBundleBuilder = require('../lib/UpdateElementBundleBuilder')
const terminalOutput = require('../lib/tools/terminalOutput')
/**
 * Build update bundle
 */
exports.build = (type, dir, elements = {}, commit, version, settings, updateSettings) => {
  dir = path.resolve(dir || process.cwd())
  if (!fs.lstatSync(dir).isDirectory()) {
    console.log(`Can't create bundle. Wrong working directory.`)
  }
  switch (type) {
    case 'editor':
      const b = new UpdateEditorBundleBuilder(dir, settings.repo, settings)
      b.build(version, commit, () => {
        terminalOutput.consoleSeparator(`Editor update bundle zip archive created!`)
      })
      break;
    case 'templates':
      const templatesBuilder = new UpdatePredefinedTemplatesBundleBuilder(dir, settings)
      templatesBuilder.build(version, () => {
        terminalOutput.consoleSeparator(`Templates update bundle zip archive created!`)
      })
      break;
    case 'categories':
      const catBuilder = new UpdateCategoriesBundleBuilder(dir, settings)
      catBuilder.build(version, () => {
        terminalOutput.consoleSeparator(`Categories update bundle zip archive created!`)
      })
      break;
    case 'assetsLibraries':
      const assetsBuilder = new UpdateAssetsLibrariesBundleBuilder(dir, settings)
      assetsBuilder.build(version, () => {
        terminalOutput.consoleSeparator(`Assets libraries update bundle zip archive created!`)
      })
      break;
    case 'element':
      const elementBuilder = new UpdateElementBundleBuilder(updateSettings, dir, settings)
      elementBuilder.build(version, () => {
        terminalOutput.consoleSeparator(`Element ${updateSettings} update bundle zip archive created!`)
      })
      break;
  }

}
