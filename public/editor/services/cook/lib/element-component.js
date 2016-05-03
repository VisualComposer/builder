let items = {};
const notFound = function() {
  throw new Error('Element Component: ' + name + ' not found.');
};
export default {
  add(name, Component) {
    items[name] = Component;
  },
  get(name) {
    if (!this.has(name)) {
      notFound();
    }
    return items[name];
  },
  has(name) {
    return !!items[name];
  },
  remove(name) {
    if (!this.has(name)) {
      notFound();
    }
    return delete items[name];
  }
};
