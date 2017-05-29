const buildTemplateFromFile = require('./lib/actions').buildTemplateFromFile
const program = require('commander')
program
  .version('0.0.1')
  .option('-t, --title <s>', 'Add title to template')
  .option('-d, --descr <s>', 'Add description to template')
  .option('-i, --id <n>', 'Add id to template')
  .option('-o, --output <s>', 'Path to output template bundle')
  .command('template <jsonFile>')
  .description('Build template directory from json file.')
  .action((jsonFile) => {
    buildTemplateFromFile(jsonFile, program.title, program.descr, program.id, program.output)
  })
program.parse(process.argv)
