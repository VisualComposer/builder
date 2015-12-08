var Mediator = require('../../helpers/Mediator');
var DataStore = {
    document: null,
    activeNode: null,
    resetActiveNode: function() {
        this.activeNode = null;
    },
    add: function() {
        if(this.activeNode) {
            var DOMelement = this.document.createElement(element.element);
            var elementId = document.createAttribute("id");       // Create a "id" attribute
            elementId.value = element.id;                           // Set the value of the class attribute
            DOMelement.setAttributeNode(elementId);
            this.activeNode.appendChild(DOMelement);
        }
        this.resetActiveNode();
        return DOMelement || false;
    }
};

// Data module
var Data = {
 // here comes public events
};
Data.subscribe('data:activeNode', function(id){
    DataStore.activeNode = DataStore.document.getElementById(id);
});

Data.subscribe('data:add', function(element) {
    DataStore.add(element) && Data.publish('data:changed', DataStore.document);
});

Data.subscribe('data:sync', function(){
    var dataString = '<Root id="vc_v-root">' + window.document.getElementById('vc_v-content').value + '</Root>';
    var parser = new DOMParser();
    DataStorage.document = parser.parseFromString(dataString);
    Data.publish('data:changed', DataStore.document);
});

module.exports = Data;