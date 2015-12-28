var Mediator = require('../../helpers/Mediator');
var Utils = require('../../helpers/Utils');
var LocalStorage = require('./LocalStorage');
/**
 * Data Module
 * @type {{document: null, add: DataStore.add, remove: DataStore.remove, clone: DataStore.clone, move: DataStore.move, get: DataStore.get}}
 */
var DataStore = {
    document: null,
    add: function (element, parentNode) {
        // @todo Here we should use immutable data.
        if (parentNode) {
            var DOMElement = this.document.createElement(element.tag);
            var elementId = document.createAttribute('id');       // Create a "id" attribute
            elementId.value = Utils.createKey();
            DOMElement.setAttributeNode(elementId);

            Object.keys(element).forEach(function (k) {
                let param = element[k];
                if ('content' === k && 'public' === param.getAccess()) {
                    let textNode = document.createTextNode(param.toString());
                    DOMElement.appendChild(textNode);
                } else if ('public' === param.getAccess()) {
                    let elementParam = document.createAttribute(k);
                    elementParam.value = param.toString();
                    DOMElement.setAttributeNode(elementParam);
                }
            }, this);

            // Set the value of the class attribute
            parentNode.appendChild(DOMElement);
        }
        // this.resetActiveNode(); // @todo need to find new way to sync with current node
        return DOMElement || false;
    },
    remove: function (id) {
        var DOMElement = this.document.getElementById(id);
        if (DOMElement) {
            DOMElement.parentNode.removeChild(DOMElement);
            return true;
        }
        return false;
    },
    clone: function (id) {
        var DOMElement = this.document.getElementById(id);
        if (DOMElement) {
            let DOMElementClone = DOMElement.cloneNode(true);
            DOMElementClone.setAttribute('id', Utils.createKey());
            DOMElement.parentNode.insertBefore(DOMElementClone, DOMElement.nextSibling)
            return true;
        }
        return false;
    },
    move: function (id, beforeId) {
        let beforeDOMElement, DOMElement = this.document.getElementById(id);
        if (DOMElement) {
            if (beforeId) {
                beforeDOMElement = this.document.getElementById(beforeId);
                if (beforeDOMElement) {
                    beforeDOMElement.parentNode.insertBefore(DOMElement, beforeDOMElement);
                    return true;
                }
            } else {
                DOMElement.parentNode.appendChild(DOMElement);
                return true;
            }
        }
        return false;
    },
    get: function (id) {
        var element = this.document.getElementById(id);
        return element;
    }
};



/**
 * Data module API
 * @type {{activeNode: null, resetActiveNode: Data.resetActiveNode}}
 */
var Data = {
    activeNode: null,
    resetActiveNode: function () {
        this.activeNode = null;
    },
    get: function (id) {
        return DataStore.get(id);
    },
    add: function (element) {
        DataStore.add(element, Data.activeNode) && Data.publish('data:changed', DataStore.document);
    },
    remove :function(id) {
        DataStore.remove(id) && Data.publish('data:changed', DataStore.document);
    },
    clone: function(id) {
        DataStore.clone(id) && Data.publish('data:changed', DataStore.document);
    },
    parse: function(dataString) {
        var parser = new DOMParser();
        return parser.parseFromString(dataString, 'text/xml');
    }
};

Mediator.installTo(Data);
Mediator.addService('data', Data);

Data.subscribe('app:add', function (id) {
    if(id) {
        Data.activeNode = DataStore.get(id);
    }
});
Data.subscribe('data:add', function (element) {
    Data.add(element);
});
Data.subscribe('data:remove', function (id) {
    Data.remove(id);
});
Data.subscribe('data:clone', function (id) {
    Data.clone(id);
});
// @todo sync how to ignore one or too object.
Data.subscribe('data:move', function (id, beforeId) {
    DataStore.move(id, beforeId) && Data.publish('data:changed', DataStore.document);
});
// Add to app
Data.subscribe('app:init', function () {
    DataStore.document = Data.parse('<Root id="vc-v-root-element">' + LocalStorage.get() + '</Root>');
    Data.publish('data:changed', DataStore.document);
});
window.vcData = Data; // @todo should be removed.

module.exports = Data;