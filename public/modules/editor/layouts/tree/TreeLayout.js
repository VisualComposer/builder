var React = require('react');
var ElementComponents = require('../../../../helpers/ElementComponents');
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
                return <Element element={element} data={data} key={element.getAttribute('id')}/>
            });
        };
        return (<ul className="vc-v-layouts-tree dropdown-menu">
            {elementsList}
        </ul>);
    }
});
module.exports = Layout;