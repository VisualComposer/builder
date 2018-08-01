import { env } from 'vc-cake'

let layoutIcons
if (env('FT_BLANK_PAGE_BOXED')) {
  layoutIcons = {
    'vc__blank': {
      icon: require('./vc__blank'),
      label: 'Blank Template'
    },
    'vc-theme__header-footer-layout': {
      icon: require('./vc-theme__header-footer-layout'),
      label: 'Header and Footer'
    },
    'vc-theme__header-footer-sidebar-left-layout': {
      icon: require('./vc-theme__header-footer-sidebar-left-layout'),
      label: 'Left Sidebar'
    },
    'vc-theme__header-footer-sidebar-layout': {
      icon: require('./vc-theme__header-footer-sidebar-layout'),
      label: 'Right Sidebar'
    },
    'theme-default': {
      icon: require('./theme-default'),
      label: 'Theme Default'
    }
  }
} else {
  layoutIcons = {
    'vc__blank': {
      icon: require('./vc__blank'),
      label: 'Blank Template'
    },
    'vc__boxed': {
      icon: require('./vc__boxed'),
      label: 'Boxed Template'
    },
    'vc-theme__header-footer-layout': {
      icon: require('./vc-theme__header-footer-layout'),
      label: 'Header and Footer'
    },
    'vc-theme__header-footer-sidebar-left-layout': {
      icon: require('./vc-theme__header-footer-sidebar-left-layout'),
      label: 'Left Sidebar'
    },
    'vc-theme__header-footer-sidebar-layout': {
      icon: require('./vc-theme__header-footer-sidebar-layout'),
      label: 'Right Sidebar'
    },
    'theme-default': {
      icon: require('./theme-default'),
      label: 'Theme Default'
    }
  }
}

export default layoutIcons
