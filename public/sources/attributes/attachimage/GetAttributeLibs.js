import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libs = []

    if (value && value.urls && value.urls[0] && value.urls[0].filter && value.urls[0].filter !== 'normal') {
      let libData = {
        name: 'imageFilter',
        dependencies: []
      }

      libs.push(libData)
    }

    return libs
  }
}
