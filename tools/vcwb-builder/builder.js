const buildTemplateFromFile = require('./controller/templates').buildFromFile
const buildPlugin = require('./controller/wpPlugin').build
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
  .action((jsonFile) => {
    buildTemplateFromFile(jsonFile, program.title, program.descr, program.id, program.output)
  })
program.command('plugin')
  .description('Build VCWB Wordpress plugin zip bundle')
  .option('-d, --dir <s>', 'Path where to create zip bundle')
  .option('-r, --repository <s>', 'Set repo for VCWB. Default: ' + settings.repo)
  .action(() => {
    console.log(program.dir)
    // buildPlugin(program.dir, program.repository || settings.repo)
  })
program.parse(process.argv)
