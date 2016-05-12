require('babel-polyfill');
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {default as elementSettings} from './element-settings';
import {default as attributeManager} from './attribute-manager';
import {default as elementComponent} from './element-component';
import {createKey} from './tools';

export default class Element {
  constructor(data) {
    let {id = createKey(), parent = false, ...attr} = data;
    Element.id = id;
    Element.parent = parent;
    Element.data = attr;
    Element.settings = elementSettings.get(Element.data.tag).settings;
    Element.getAttributeType = function(k) {
      let data = {type: false, settings: false};
      let attrSettings = this.settings[k];
      if (attrSettings && attrSettings.type) {
        data.settings = attrSettings;
        data.type = attributeManager.get(attrSettings.type) || false;
      }
      return data;
    };
    Element.component = {
      add(Component) {
        elementComponent.add(Element.data.tag, Component);
      },
      get() {
        return elementComponent.get(Element.data.tag);
      },
      has() {
        return elementComponent.has(Element.data.tag);
      }
    };
    Element.scope = 'value';
  }

  get(k) {
    if('id' == k) {
      return Element.id;
    }
    let {type, settings} = Element.getAttributeType(k);
    return type && settings ? type.getValue(settings, Element.data, k) : undefined;
  }

  set(k, v) {
    let {type, settings} = Element.getAttributeType(k);
    if (type && settings) {
      Element.data = type.setValue(settings, Element.data, k, v);
    }
    return Element.data[k];
  }

  render(content) {
    if (!Element.component.has()) {
      elementSettings.get(Element.data.tag).component(Element.component);
    }
    let Component = Element.component.get();
    let props = this.toJS();
    props.key = Element.id;
    props.id = Element.id;
    props['data-vc-element'] = Element.id;
    props.content = content;
    return React.createElement(Component, props);
  }
  static create(tag) {
    return new Element({tag: tag});
  }
  toJS() {
    let data = {};
    for (let k of Object.keys(Element.settings)) {
      data[k] = this.get(k);
    }
    return data;
  }
  *[Symbol.iterator]() {
    for (let k of Object.keys(Element.settings)) {
      yield [k, this.get(k)];
    }
  }
  field(k, updater) {
    let {type, settings} = Element.getAttributeType(k);
    let Component = type.component;
    let label = '';
    if (typeof (settings.options) !== 'undefined' && typeof (settings.options.label) === 'string') {
      label = (<label className="vc_ui-form-group-heading">{settings.options.label}</label>);
    }
    let description = '';
    if (typeof (settings.options) !== 'undefined' && typeof (settings.options.description) === 'string') {
      description = (<p className="vc_ui-form-helper">{settings.options.description}</p>);
    }
    return (
      <div className="vc_ui-form-group">
        {label}
        <Component
          fieldKey={k}
          options={settings.options}
          value={type.getRawValue(Element.data, k)}
          updater={updater}
        />
        {description}
      </div>
    );
  }
  renderHTML(content) {
    return renderToStaticMarkup(this.render())
  }
  publicKeys() {
    let data = [];
    for (let k of Object.keys(Element.settings)) {
      var attrSettings = Element.settings[k];
      if ('public' === attrSettings.access) {
        data.push(k);
      }
    }
    return data;
  }
}
