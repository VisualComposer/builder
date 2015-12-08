var Mediator = require('../../helpers/Mediator');
var DataStore = {
    document: null,
    activeNode: null,
    resetActiveNode: function() {
        this.activeNode = null;
    },
    add: function(element) {
        if(this.activeNode) {
            var DOMElement = this.document.createElement(element.element);
            var elementId = document.createAttribute("id");       // Create a "id" attribute
            elementId.value = element.id;                           // Set the value of the class attribute
            DOMElement.setAttributeNode(elementId);
            this.activeNode.appendChild(DOMElement);
        }
        this.resetActiveNode();
        return DOMElement || false;
    }
};

// Data module
var Data = {
 // here comes public events
};
Mediator.installTo(Data);

Data.subscribe('data:activeNode', function(id){
    DataStore.activeNode = DataStore.document.getElementById(id);
});

Data.subscribe('data:add', function(element) {
    DataStore.add(element) && Data.publish('data:changed', DataStore.document);
});

Data.subscribe('data:sync', function(){
    var dataString = '<Root id="vc-v-root-element">' + window.document.getElementById('vc_v-content').value + '</Root>';
    var parser = new DOMParser();
    DataStore.document = parser.parseFromString(dataString, 'text/xml');
    Data.publish('data:changed', DataStore.document);
});

module.exports = Data;