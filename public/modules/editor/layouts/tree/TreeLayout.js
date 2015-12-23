var React = require('react');
require('./less/tree/tree-init.less');
var Utils = require('../../../../helpers/Utils');
var Element = require('./Element.js');
var Layout = React.createClass({
    render: function () {
        let elementsList;

        if (this.props.data.childNodes) {
            let data = Array.prototype.slice.call(this.props.data.childNodes);
            let rootElement = data[0];
            elementsList = Array.prototype.slice.call(rootElement.childNodes).map(function (element) {
                let data = Array.prototype.slice.call(element.childNodes);
                return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
            });
        }
        return (<div className="vc_ui-tree-dropdown dropdown-menu">
            <div className="vc_ui-tree-nodes-container">
                <ul className="vc_ui-tree-node">
                    {elementsList}
                </ul>
            </div>
            <div className="vc_ui-tree-nodes-controls">controls</div>
        </div>);
    }
});
module.exports = Layout;