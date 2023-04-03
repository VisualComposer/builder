const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'pgo3fe',
  env: {
    baseUrl: 'http://localhost/',
    wpUserName: 'admin',
    wpPassword: '12345',
    dataPlugin: 'builder/plugin-wordpress.php',
    newPage: '/wp-admin/post-new.php?post_type=page&vcv-action=frontend',
    vcvAdminAjaxUrl: '/wp-admin/admin-ajax.php?vcv-admin-ajax=1&action=vcv-admin-ajax',
    serverType: 'ci',
    checkSnapshots: false,
  },
  video: true,
  pageLoadTimeout: 80000,
  execTimeout: 350000,
  requestTimeout: 10000,
  viewportWidth: 1200,
  viewportHeight: 800,
  wpUserName: 'admin',
  wpPassword: '12345',
  dataPlugin: 'builder/plugin-wordpress.php',
  newPage: '/wp-admin/post-new.php?post_type=page&vcv-action=frontend',
  vcvAdminAjaxUrl: '/wp-admin/admin-ajax.php?vcv-admin-ajax=1&action=vcv-admin-ajax',
  serverType: 'ci',
  checkSnapshots: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost/',
  },
})
