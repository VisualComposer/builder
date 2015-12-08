var React = require('react');
var Section = React.createClass({
    render: function() {
        return (<section className="vc-v-section" key={this.props.key}>This is section</section>);
    }
});
module.exports = Section;