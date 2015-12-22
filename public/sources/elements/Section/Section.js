var React = require('react');
require('./Section.less');
var Section = React.createClass({
    render: function() {
        var { key, content, controls, ...other } = this.props;
        return (<section className="vc-v-section" key={key} {...other}>
            {content}{controls || ''}
        </section>);
    }
});
module.exports = Section;