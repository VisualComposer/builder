var ElementsSettings = require('../../../sources/elements/elements-settings');
var ElementsList = {
  items: false,
  getElementsData: function() {
    if (!this.items) {
      ElementsList.items = {};
      ElementsSettings.forEach(function(settings) {
        var tag = settings.tag.value;
        ElementsList.items[tag] = {};
        Object.keys(settings).forEach(function(k) {
          var optionKey = k;
          ElementsList.items[tag][optionKey] = (function(option) {
            var optionSettings = {
              key: optionKey,
              access: option.access || 'public',
              type: option.type || null,
              default: option.value || null,
              getter: k,
              value: null,
              title: option.title || optionKey,
              settings: option.settings || null
            };
            var Parameter = {
              toString: function() {
                if (optionSettings.access === 'private') {
                  return undefined;
                }
                return optionSettings.value || optionSettings.default || undefined;
              },
              setValue: function(value) {
                if ('public' === this.getAccess()) {
                  optionSettings.value = value;
                  return true;
                }
                return false;
              },
              getAccess: function() {
                return optionSettings.access;
              },
              getType: function() {
                return optionSettings.type;
              },
              valueOf: function() {
                return this.toString();
              },
              getTitle: function() {
                return optionSettings.title;
              },
              getSettings: function() {
                return optionSettings.settings;
              },
              getDefault: function() {
                return optionSettings.default;
              }
            };
            return Parameter;
          })(settings[k]);
        });
      });
    }
    return this.items;
  }
};

module.exports = {
  getElementsList: function() {
    ElementsList.getElementsData();
    return ElementsList.items;
  },
  getElement: function(element) {
    return require('../../../sources/elements/' + element.tagName + '/' + element.tagName + '.js');
  },
  get: function(element, currentData) {
    var tag = element.tagName ? element.tagName : element.toString();
    ElementsList.getElementsData();
    var data = ElementsList.items[tag] || {};
    let returnData = {};
    if (currentData) {
      Object.keys(data).forEach(function(k) {
        let paramData = Object.create(data[k]);
        if (currentData[k]) {
          paramData.setValue(currentData[k]);
        }
        returnData[k] = paramData;
      }, this);
    } else {
      returnData = data;
    }
    return returnData;
  }
};