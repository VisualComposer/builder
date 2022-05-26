import { addService } from 'vc-cake'

const RoleManager = {
  can (part, defaultValue = true) {
    if (typeof window.VCV_USER_ACCESS !== 'undefined') {
      if (typeof window.VCV_USER_ACCESS()['*'] !== 'undefined') {
        return window.VCV_USER_ACCESS()['*']
      }

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
