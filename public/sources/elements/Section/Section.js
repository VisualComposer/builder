var React = require('react');
require('./Section.less');
var Section = React.createClass({
    render: function() {
        var { key, content, controls, ...other } = this.props;
        return (<section className="vc-v-section" key={key} {...other}>
            {content ? 'Hello my name is Boris and I know ninja rules very well. Hide away.' : ''}{controls || ''}
        </section>);
    }
});
module.exports = Section;