export default class {
  constructor(name, component, settings) {
    this.name = name;
    this.component = component;
    this.settings = settings;

    this.setter = null;
    this.getter = null;
  }

  setSetter(setter) {
    this.setter = setter;
  }

  setGetter(getter) {
    this.getter = getter;
  }

  getValue(element, key) {
    return this.getter ? this.getter(element, key, this.settings) : element[key];
  }

  setValue(element, key, value) {
    if (this.setter) {
      element = this.setter(element, key, value, this.settings);
    } else {
      element[key] = value;
    }
    return element;
  }

  getField() {
    return this.component;
  }
}