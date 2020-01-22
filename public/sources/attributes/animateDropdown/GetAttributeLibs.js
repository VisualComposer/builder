export default (value) => {
  const libs = []

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
