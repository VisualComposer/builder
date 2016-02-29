var vcCake = require('vc-cake');
require('./wp-services');
vcCake.start(function() {
	require('./wp-modules');
});
window.app = vcCake;
