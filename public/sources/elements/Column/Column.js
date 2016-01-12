var React = require('react');
var classNames = require('classnames');

require('./editor/Column.less');
var Column = React.createClass({
    render: function() {
        var { key, content, width, ...other } = this.props;
		var classes = {
			"vc-v-column": true
		};
		classes[ "col-xs-" + width ] = ! ! width;
		classes[ "col-sm-" + width ] = ! ! width;
		classes[ "col-md-" + width ] = ! ! width;
		classes[ "col-lg-" + width ] = ! ! width;
		var className = classNames( classes );
        return (<div className={className} key={key} {...other}>
            {content}
        </div>);
    }
});
module.exports = Column;