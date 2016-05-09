var React = require('react');

var data = React.createClass({
render: function() {
// import variables
{{ variables() }}
// import template js
{{ templateJs() }}
// import template
return {{ template() }};
}
});
console.log('data: ',data);