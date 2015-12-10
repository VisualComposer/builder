var Mediator = require('./Mediator');
var ElementsList = [
    { element: 'Section', name: 'Section', icon: 'glyphicon glyphicon-oil' },
    { element: 'Paragraph', name: 'Paragraph', icon: 'glyphicon glyphicon-font' },
    { element: 'Button', name: 'Button', icon: 'glyphicon glyphicon-modal-window' }
];

var Elements = {
    getElementsList: function(){
        return ElementsList;
    },
    getElement: function(element) {
        return require('../sources/elements/' + element.element + '/' + element.element +'.js');
    }
};

Mediator.installTo(Elements);

module.exports = Elements;