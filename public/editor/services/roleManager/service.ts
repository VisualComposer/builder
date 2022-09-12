import { addService } from 'vc-cake'

declare global {
  interface Window {
    vcvManageOptions: boolean,
    VCV_USER_ACCESS: () => {
      '*': boolean,
      part: boolean
    }
  }
}

const RoleManager = {
  can (part:string, defaultValue = true) {
    if (typeof window.VCV_USER_ACCESS !== 'undefined') {
      if (typeof window.VCV_USER_ACCESS()['*'] !== 'undefined') {
        return window.VCV_USER_ACCESS()['*']
      }

      // @ts-ignore accessing object property via bracket notation
      return !!window.VCV_USER_ACCESS()[part]
    }

    // no addon available
    return defaultValue
  },
  canState () {
    // do nothing
  },
  defaultAdmin () {
    return window.vcvManageOptions
  },
  defaultTrue () {
    return true
  }
}

addService('roleManager', RoleManager)
