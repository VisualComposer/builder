var React = require('react');
require('./TreeLayout.less');
var Utils = require('../../../../helpers/Utils');
var Element = require('./Element.js');
var Layout = React.createClass({
    render: function() {
        let elementsList;
        if(this.props.data.childNodes) {
            let data = Array.prototype.slice.call(this.props.data.childNodes);
            elementsList = data.map(function( element ){
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={{element: element.tagName, id: element.getAttribute('id')}} data={data} key={element.getAttribute('id')}/>
            });
        }
        return (<ul className="vc-v-layouts-tree">
            {elementsList}
        </ul>);
    }
});
module.exports = Layout;