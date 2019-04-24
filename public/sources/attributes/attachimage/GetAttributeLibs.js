export default (value) => {
  let libs = []
  let filterName = null

  if (value instanceof Array) { // For multiple images
    filterName = value[ 0 ] && value[ 0 ] && value[ 0 ].filter
  } else { // For single image
    filterName = value && value.filter
  }

  if (filterName !== 'normal') {
    let libData = {
      name: 'imageFilter',
      dependencies: []
    }
    libs.push(libData)
  }

  return libs
}
