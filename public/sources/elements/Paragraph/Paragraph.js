var React = require('react');
var Paragraph = React.createClass({
    render: function() {
        var { key, content, controls, ...other } = this.props;
        return (<p className="vc-text-block" key={key} {...other}>
            {content ? 'Hello my name is Boris and I know ninja rules very well. Hide away.' : ''}{controls || ''}
        </p>);
    }
});
module.exports = Paragraph;