export default (value) => {
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
