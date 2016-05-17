var React = require('react');

module.exports = React.createClass({
render: function() {
// import variables
{{ variables() }}
// import template js
{{ templateJs() }}
// import template
return {{ template() }};
}
});