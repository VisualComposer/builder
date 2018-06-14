let items = {}
const notFound = function (name) {
  console.error('Element Component: ' + name + ' not found.')
}
export default {
  add (name, Component) {
    items[ name ] = Component
  },
  get (name) {
    if (!this.has(name)) {
      notFound(name)
    }
    return items[ name ]
  },
  has (name) {
    return !!items[ name ]
  },
  remove (name) {
    if (!this.has(name)) {
      notFound(name)
    }
    return delete items[ name ]
  }
}
