var vcCake = require('vc-cake');
var React = require('react');
require('../css/html-layout.less');
var Element = require('./element');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var SortableMixin = {
  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  }
};

var Layout = React.createClass({
  render: function() {
    let documentData = vcCake.getService('document');
    let elementsList;
    if (this.props.data) {
      elementsList = this.props.data.map(function(element) {
        let data = documentData.children(element.id);
        return <Element element={element} data={data} key={element.id} level={1}/>
      });
    }
    return (<div className="vc-v-layouts-html">
      {elementsList}
    </div>);
  }
});
module.exports = DragDropContext(HTML5Backend)(Layout);
