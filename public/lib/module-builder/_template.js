var vcCake = require('vc-cake');

vcCake.add('{{ module }}', function(api) {
  require('./css/module.less');
  // Here comes wrapper
  var wrapper = document.createElement('div');
  wrapper.setAttribute('id', 'vc-{{ module }}-wrapper');
  document.body.appendChild(wrapper);
});
