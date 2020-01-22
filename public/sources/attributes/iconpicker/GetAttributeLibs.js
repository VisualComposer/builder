export default (value) => {
  const libs = []

  if (value && value.icon && value.iconSet) {
    const libData = {
      name: 'iconpicker',
      subset: value.iconSet,
      dependencies: []
    }

    libs.push(libData)
  }

  return libs
}
