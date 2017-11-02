import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libs = []

    if (value && value.icon && value.iconSet) {
      let libData = {
        name: 'iconpicker',
        dependencies: []
      }

      libs.push(libData)
    }

    return libs
  }
}
