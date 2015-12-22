var ElementsSettings = require('../sources/elements/ElementsSettings');
var ElementsList = {
    items: false,
    getElementsData: function() {
        if(!this.items) {
            ElementsList.items = {};
            ElementsSettings.forEach(function(settings){
                var tag = settings.tag.value;
                ElementsList.items[tag] = {};
                Object.keys(settings).forEach(function (k) {
                    ElementsList.items[tag][k] = (function(option){
                            var optionSettings = {
                                access: option.access || 'public',
                                type: option.type || null,
                                default: option.value || null,
                                value: null
                            };
                            var Parameter = function() {};
                            Parameter.prototype = {
                                constructor: String,
                                toString: function() {
                                    if(optionSettings.access === 'private') {
                                        return undefined;
                                    }
                                    return optionSettings.value || optionSettings.default || undefined;
                                },
                                setValue: function(value) {
                                    if('public' === this.getAccess()) {
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
                                getFormComponent: function() {
                                    // @todo Here we can add logic to return template for paramType :)
                                },
                                valueOf: function() {
                                    return this.toString();
                                }
                            };
                            return new Parameter();
                        })(settings[k]);
                });
            });
        }
        return this.items;
    }
};

module.exports = {
    getElementsList: function () {
        ElementsList.getElementsData();
        return ElementsList.items;
    },
    getElement: function (element) {
        return require('../sources/elements/' + element.tag + '/' + element.tag + '.js');
    },
    getElementData: function (tag, currentData) {
        ElementsList.getElementsData();
        var data = ElementsList.items[tag] || {};
        var returnData = {};
        if(currentData) {
            Object.keys(data).forEach(function(k){
                let paramData = Object.create(data[k]);
                if(currentData[k]) {
                    paramData.setValue(currentData[k]);
                }
                returnData[k] = paramData;
            }, this);
        } else {
            returnData = Object.create(data);
        }
        return returnData;
    },
};