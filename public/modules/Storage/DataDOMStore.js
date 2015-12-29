var Mediator = require('../../helpers/Mediator');
var Utils = require('../../helpers/Utils');
var LocalStorage = require('./LocalStorage');
/**
 * Data Module
 * @type {{document: null, add: DataStore.add, remove: DataStore.remove, clone: DataStore.clone, move: DataStore.move, get: DataStore.get}}
 */
var DataStore = {
    document: null,
    create: function(element) {
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
        return DOMElement;
    },
    add: function (element, parentNode) {
        // @todo Here we should use immutable data.
        if (parentNode) {
           let DOMElement = this.create(element);
            // Set the value of the class attribute
            parentNode.appendChild(DOMElement);
            return DOMElement;
        }
        return false;
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
    mutate: function(element) {
/*        var DOMElement = this.document.getElementById(element.getAttribute('id'));
        DOMElement.setAttribute('id', 'vc-mutate-tmp-' + Math.random());
        DOMElement.parentNode.insertBefore(element, DOMElement);
        DOMElement.parentNode.removeChild(DOMElement);*/
        return true;
    },
    get: function (id) {
        var DOMElement = this.document.getElementById(id);
        return DOMElement; // .cloneNode(true);
    }
};



/**
 * Data module API
 * @type {{activeNode: null, resetActiveNode: Data.resetActiveNode}}
 */
var Data = {
    activeNode: null,
    getDocument: function() {
        return DataStore.document ? DataStore.document : null;
    },
    resetActiveNode: function () {
        this.activeNode = null;
    },
    get: function (id) {
        return DataStore.get(id);
    },
    add: function (element) {
        DataStore.add(element, Data.activeNode) && Data.publish('data:changed', this.getDocument());
    },
    remove :function(id) {
        DataStore.remove(id) && Data.publish('data:changed', this.getDocument());
    },
    clone: function(id) {
        DataStore.clone(id) && Data.publish('data:changed',  this.getDocument());
    },
    parse: function(dataString) {
        return (new DOMParser()).parseFromString(dataString, 'text/xml');
    },
    mutate: function(element) {
        DataStore.mutate(element) && Data.publish('data:changed',  this.getDocument());
    },
    move: function(id, beforeId) {
        DataStore.move(id, beforeId) && Data.publish('data:changed', this.getDocument());
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
Data.subscribe('data:mutate', function(element){
   Data.mutate(element);
});
Data.subscribe('data:move', function (id, beforeId) {
    Data.move(id, beforeId);
});
// Add to app
Data.subscribe('app:init', function () {
    DataStore.document = Data.parse('<Root id="vc-v-root-element">' + LocalStorage.get() + '</Root>');
    Data.publish('data:changed', Data.getDocument());
});
window.vcData = Data; // @todo should be removed.

module.exports = Data;