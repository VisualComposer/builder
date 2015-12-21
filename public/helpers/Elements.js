var Mediator = require('./Mediator');
var ElementsSettings = require('../sources/elements/ElementsSettings');
var ElementsList = {
    elements: false
};

var Elements = {
    getElementsList: function(){
        if(!ElementsList.elements) {
            ElementsList.elements = {};
            ElementsSettings.forEach(function(settings){
                ElementsList.elements[settings.key.value] = {
                    tag: settings.key.value,
                    name: settings.name.value,
                    icon: settings.icon ? settings.icon.value : null
                };
            });
        }
        return ElementsList.elements;
    },
    getElement: function(element) {
        return require('../sources/elements/' + element.tag + '/' + element.tag +'.js');
    },
    getElementSettings: function(tag) {
        var elementsList = this.getElementsList();
        return elementsList[tag] || {name: false, tag: false};
    }
};

Mediator.installTo(Elements);
module.exports = Elements;