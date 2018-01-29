import vcCake from 'vc-cake'

let layout = {
  current: 'default',
  all: {
    'Header': {
      template: 'vcv-header-layout.php',
      header: true
    },
    'Header Footer': {
      template: 'vcv-header-footer-layout.php',
      header: true,
      footer: true
    },
    'Footer': {
      template: 'vcv-footer-layout.php',
      footer: true
    }
  }
}

const API = {
  all: () => {
    return layout.all
  },
  get: (name) => {
    return layout && layout.all && layout.all[name] || null
  }
}

vcCake.addService('vcThemeLayouts', API)
