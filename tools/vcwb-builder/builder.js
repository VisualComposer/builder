const buildTemplateFromFile = require('./controller/templates').buildFromFile
const buildPlugin = require('./controller/wpPlugin').build
const buildElements = require('./controller/elements').build
const buildUpdate = require('./controller/updates').build
const program = require('commander')
const fs = require('fs-extra')
const path = require('path')

const settings = fs.readJSONSync(path.join(__dirname, 'sources', 'settings.json'))
program
  .version('0.0.1')
  .command('template <jsonFile>')
  .description('Build template directory from json file.')
  .option('-t, --title <s>', 'Add title to template')
  .option('-d, --descr <s>', 'Add description to template')
  .option('-i, --id <n>', 'Add id to template')
  .option('-o, --output <s>', 'Path to output template bundle')
  .action((jsonFile, options) => {
    buildTemplateFromFile(jsonFile, options.title, options.descr, options.id, options.output)
  })
program.command('plugin')
  .description('Build VCWB Wordpress plugin zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-r, --repository <s>', 'Set repo for VCWB. Default: ' + settings.repo)
  .option('-c, --builderCommit <s>', 'Select commit SHA1 for VCWB')
  .option('-b, --bundleVersion <s>', 'Add version to bundle.')
  .action((options) => {
    buildPlugin(options.path, options.repository || settings.repo, options.builderCommit, options.bundleVersion)
  })
program.command('elements')
  .description('Build VCWB elements bundle zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-r, --repository <s>', 'Set repo for VCWB. Default: ' + settings.repo)
  .option('-ar, --accountRepository <s>', 'Set repo for Account. Default: ' + settings.accountRepo)
  .option('-e, --elementsJSON <s>', 'Set JSON file path for a list of elements.')
  .option('-c, --builderCommit <s>', 'Select commit SHA1 for VCWB.')
  .option('-b, --bundleVersion <s>', 'Add version to bundle.')
  .action((options) => {
    const elements = options.elementsJSON ? fs.readJsonSync(options.elementsJSON, { throws: false }) : settings.bundleElements
    buildElements(
      options.path,
      options.repository || settings.repo,
      options.accountRepository || settings.accountRepo,
      elements,
      options.builderCommit,
      options.bundleVersion, settings)
  })
program.command('update <type> [updateSettings ...]')
  .description('Build VCWB update bundle zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-e, --elementsJSON <s>', 'Set JSON file path for a list of elements.')
  .option('-c, --builderCommit <s>', 'Select commit SHA1 for VCWB.')
  .option('-b, --bundleVersion <s>', 'Add version to bundle.')
  .action((type, updateSettings, options) => {
    const elements = options.elementsJSON ? fs.readJsonSync(options.elementsJSON, { throws: false }) : settings.bundleElements
    buildUpdate(
      type,
      options.path,
      elements,
      options.builderCommit,
      options.bundleVersion, settings, updateSettings)
  })
program.parse(process.argv)
