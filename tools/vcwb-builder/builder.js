const buildTemplateFromFile = require('./controller/templates').buildFromFile
const buildPlugin = require('./controller/wpPlugin').build
const buildElements = require('./controller/elements').build
const program = require('commander')
const settings = require('./sources/settings')
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
  .action((options) => {
    buildPlugin(options.path, options.repository || settings.repo)
  })
program.command('elements')
  .description('Build VCWB elements bundle zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-r, --repository <s>', 'Set repo for VCWB. Default: ' + settings.repo)
  .action((options) => {
    buildElements(options.path, options.repository || settings.repo)
  })
program.parse(process.argv)
