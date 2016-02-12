var vcCake = require('vc-cake');

vcCake.add('ui-wordpress', function(api) {
  require('./css/module.less');
  var Component = React.createClass(reactObject);
  // Here comes wrapper for navbar
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-t-wrapper');
  document.body.appendChild(wrapper);
  ReactDOM.render(
    <Component/>,
    wrapper
  );
});