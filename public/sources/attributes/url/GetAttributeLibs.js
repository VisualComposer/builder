export default (value) => {
  const libs = []
  if (value && value.type === 'popup') {
    const libData = {
      name: 'popup',
      dependencies: []
    }
    libs.push(libData)
  }

  return libs
}
