export default (value) => {
  const libs = []
  let filterName = null
  let hasPopup = false

  if (value instanceof Array) { // For multiple images
    filterName = value[0] && value[0] && value[0].filter

    value.forEach((item) => {
      if (item.link && item.link.type === 'popup') {
        hasPopup = true
      }
    })
  } else { // For single image
    filterName = value && value.filter

    if (value.link && value.link.type === 'popup') {
      hasPopup = true
    }
  }

  if (filterName !== 'normal') {
    const libData = {
      name: 'imageFilter',
      dependencies: []
    }
    libs.push(libData)
  }

  if (hasPopup) {
    const libData = {
      name: 'popup',
      dependencies: []
    }
    libs.push(libData)
  }
  return libs
}
