const Plugin = require('./controller/plugin')
const program = require('commander')

program.command('plugin')
  .description('Build VCWB Wordpress plugin zip archive')
  .option('-p, --path <s>', 'Path where to create zip file')
  .option('-b, --bundleVersion <s>', 'Add version to bundle.')
  .option('--isDev', 'Is it a development version')
  .action((options) => {
    const plugin = new Plugin(options.path, options.bundleVersion, options.isDev)
    plugin.build()
  })
program.parse(process.argv)
