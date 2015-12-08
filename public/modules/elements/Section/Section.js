var React = require('react');
var Section = React.createClass({
    render: function() {
        return (<section className="vc-v-section" key={this.props.key}></section>);
    }
});
module.exports = Section;