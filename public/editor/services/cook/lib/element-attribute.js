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

  getValue(data, key) {
    if ('undefined' === typeof data[key] && 'undefined' !== typeof this.settings.value) {
      data[key] = this.settings.value;
    }
    return this.getter ? this.getter(data, key, this.settings) : this.getRawValue(data, key);
  }

  setValue(data, key, value) {
    if ('public' === this.settings.access) {
      return this.setter ? this.setter(data, key, value, this.settings) : this.setRawValue(data, key);
    }
    return data;
  }
  setRawValue(data, key, value) {
    data[key] = value;
    return data;
  }
  getRawValue(data, key) {
    return data[key];
  }
  getField() {
    return this.component;
  }
}
