export default (value) => {
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
