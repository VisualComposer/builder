var Mediator = require('../helpers/Mediator');
var contentElement = document.getElementById('content');
var WpContent = {
	parseSavedHtml: function() {

	},
	saveContentHtml: function() {

	}
};
module.exports = (function(){
	return {
		getContent: function() {
			return WpContent.parseSavedHtml();
		},
		setContent: function(data, content) {
			return WpContent.saveContentHtml(data, content);
		}
	};
})();
Mediator.installTo( WpContent );


