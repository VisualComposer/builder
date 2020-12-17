import { addStorage } from 'vc-cake'
import fontawesome from './lib/fontawesome-5.10.2'
import socials from './lib/socials'
import cart from './lib/cart'

const premiumIconSets = ['lineicons', 'entypo', 'monosocial', 'typicons', 'openiconic', 'material', 'batch', 'mfglabs', 'metrize', 'dripicons', 'feather', 'linearicons', 'jam', 'evil', 'zondicons', 'socialicons']

addStorage('attributes', (storage) => {
  // Icon picker default state
  storage.state('iconpicker:iconSet').set({ icons: {}, socials: {}, cart: {} })

  /**
   * Default icons for iconpicker
   */
  storage.on('start', () => {
    const iconSet = storage.state('iconpicker:iconSet').get()
    // v5.10.2 https://fontawesome.com/how-to-use/on-the-web/setup/hosting-font-awesome-yourself
    iconSet.icons.fontawesome = { iconData: fontawesome }
    premiumIconSets.forEach((libName) => {
      if (!Object.prototype.hasOwnProperty.call(iconSet.icons, libName)) {
        iconSet.icons[libName] = { premium: true }
      }
    })
    iconSet.socials.socials = { iconData: socials }
    iconSet.cart.cart = { iconData: cart }

    storage.state('iconpicker:iconSet').set(iconSet)
  })

  /**
   * Add functionality for icons
   */
  storage.on('iconpicker:add', (type, name, icons) => {
    const iconSet = storage.state('iconpicker:iconSet').get()
    if (!iconSet[type]) {
      iconSet[type] = {}
    }
    if (!iconSet[type][name]) {
      iconSet[type][name] = {}
    }
    // Always override
    iconSet[type][name] = { iconData: icons }

    storage.state('iconpicker:iconSet').set(iconSet)
  })
})
