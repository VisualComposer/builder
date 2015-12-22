var Mediator = require('../../helpers/Mediator');
var Utils = require('../../helpers/Utils');
var LocalStorage = require('./LocalStorage');
var DataStore = {
    document: null,
    add: function(element, parentNode) {
        // @todo Here we should use immutable data.
        if(parentNode) {
            var DOMElement = this.document.createElement(element.tag);
            var elementId = document.createAttribute('id');       // Create a "id" attribute
            elementId.value = Utils.createKey();
            Object.keys(element).forEach(function(k){
                let param = element[k];
                let elementParam = document.createAttribute(k);
                elementParam.value = param.toString();
                DOMElement.setAttributeNode(elementParam);
            }, this);
            // Set the value of the class attribute
            DOMElement.setAttributeNode(elementId);
            parentNode.appendChild(DOMElement);
        }
        // this.resetActiveNode(); // @todo need to find new way to sync with current node
        return DOMElement || false;
    },
    remove: function(id) {
        var DOMElement = this.document.getElementById( id );
        if(DOMElement) {
            DOMElement.parentNode.removeChild( DOMElement );
            return true;
        }
        return false;
    },
    clone: function(id) {
        var DOMElement = this.document.getElementById( id );
        if(DOMElement) {
            let DOMElementClone = DOMElement.cloneNode(true);
            DOMElementClone.setAttribute('id', Utils.createKey());
            DOMElement.parentNode.insertBefore(DOMElementClone, DOMElement.nextSibling)
            return true;
        }
        return false;
    },
    move: function(id, beforeId) {
        let beforeDOMElement, DOMElement = this.document.getElementById( id );
        if(DOMElement) {
            if(beforeId) {
                beforeDOMElement = this.document.getElementById( beforeId );
                if(beforeDOMElement) {
                    beforeDOMElement.parentNode.insertBefore(DOMElement, beforeDOMElement);
                    return true;
                }
            } else {
                DOMElement.parentNode.appendChild(DOMElement);
                return true;
            }
        }
        return false;
    }
};

// Data module
var Data = {
    activeNode: null,
    resetActiveNode: function() {
        this.activeNode = null;
    },
};
Mediator.installTo(Data);

Data.subscribe('data:activeNode', function(id){
    Data.activeNode = DataStore.document.getElementById(id);
});

Data.subscribe('data:add', function(element) {
    DataStore.add(element, Data.activeNode) && Data.publish('data:changed', DataStore.document);
});
Data.subscribe('data:remove', function(id) {
    DataStore.remove(id) && Data.publish('data:changed', DataStore.document);
});
Data.subscribe('data:clone', function(id) {
    DataStore.clone(id) && Data.publish('data:changed', DataStore.document);
});

// @todo sync how to ignore one or too object.
Data.subscribe('data:move', function(id, beforeId){
    DataStore.move(id, beforeId) && Data.publish('data:changed', DataStore.document);
});

// Add to app
Data.subscribe('app:init', function(){
    var dataString =  '<Root id="vc-v-root-element">' + LocalStorage.get() + '</Root>';
    var parser = new DOMParser();
    DataStore.document = parser.parseFromString(dataString, 'text/xml');
    Data.publish('data:changed', DataStore.document);
});
window.vcData = Data; // @todo remove after presentation
module.exports = Data;