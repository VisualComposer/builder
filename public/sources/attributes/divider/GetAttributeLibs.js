import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libData = {
      name: 'divider',
      dependencies: []
    }
    let isActiveAttribute = false

    if (value && value.device && Object.keys(value.device).length) {
      let deviceKeys = Object.keys(value.device)
      deviceKeys.forEach((device) => {
        if (!isActiveAttribute && (value.device[ device ].dividerTop || value.device[ device ].dividerBottom)) {
          isActiveAttribute = true
        }
      })
    }
    return isActiveAttribute ? libData : {}
  }
}
