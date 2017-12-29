var createReactClass = require('create-react-class');

module.exports = createReactClass({
render: function() {
// import variables
{{ variables() }}
// import template js
{{ templateJs() }}
// import template
return {{ template() }};
}
});