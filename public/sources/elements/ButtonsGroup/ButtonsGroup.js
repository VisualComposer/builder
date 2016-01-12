var React = require('react');
require('./ButtonsGroup.less');
var Section = React.createClass({
    render: function() {
        var { key, content, ...other } = this.props;
        return (<div className="vc-buttons-group" key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Section;