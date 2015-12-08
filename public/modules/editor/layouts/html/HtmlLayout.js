var React = require('react');
require('./HtmlLayout.less');
var Utils = require('../../../helpers/Utils');

var Layout = React.createClass({
    render: function() {
        let elementsList = this.props.data.map(function(element){
            return <Element element="{element}"/>
        });
        return (<div className="vc_v-content">
            {elementsList}
        </div>);
    }
});
module.exports = Layout;