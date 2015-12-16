var React = require('react');
var ReactDOM = require('react-dom');
require('./HtmlLayout.less');
var Utils = require('../../../../helpers/Utils');
var Element = require('./Element.js');
var SortableMixin = {
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    }
};

var Layout = React.createClass({
    mixins: [SortableMixin],
    render: function() {
        let elementsList;
        if(this.props.data.childNodes) {
            let data = Array.prototype.slice.call(this.props.data.childNodes);
            elementsList = data.map(function( element ){
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data} key={element.getAttribute('id')}/>
            });
        }
        return (<div className="vc-v-layouts-html">
            {elementsList}
        </div>);
    }
});
module.exports = Layout;