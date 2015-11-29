var Mediator = require( '../../helpers/Mediator' ); // need to remove too
var contentElement = document.getElementById('content');
var dataStore = document.getElementById('vc-v-data');
var WpContent = {
	updateContent: function(content) {
		contentElement.value = content;
	},
	updateDataStore: function(data) {
		dataStore.value = JSON.stringify(data);
	},

};

Mediator.installTo( WpContent );
WpContent.subscribe('store:change', function(data){
	WpContent.updateDataStore(data);
});

module.exports = WpContent;



