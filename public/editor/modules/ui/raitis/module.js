var vcCake = require('vc-cake');

vcCake.add('ui-raitis', function(api) {
  require('./css/module.less');
  // Here comes wrapper
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-ui-raitis-wrapper');
  document.body.appendChild(wrapper);
});
