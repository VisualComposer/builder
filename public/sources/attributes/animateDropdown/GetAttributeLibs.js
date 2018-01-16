import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libs = []

    if (value) {
      const libData = {
        name: 'animate',
        dependencies: [
          'waypoints'
        ]
      }

      libs.push(libData)
    }

    return libs
  }
}
