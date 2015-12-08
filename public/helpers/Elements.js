var Mediator = require('./Mediator');
var ElementsList = [
    { element: 'Section', name: 'Section' },
    { element: 'Paragraph', name: 'Paragraph' },
    { element: 'Button', name: 'Button' }
];

var Elements = {
    getElementsList: function(){
        return ElementsList;
    },
    getElement: function(element) {
        console && console.log(element); // @todo remove after presentation
        return require('../sources/elements/' + element.element + '/' + element.element +'.js');
    }
};

Mediator.installTo(Elements);

module.exports = Elements;