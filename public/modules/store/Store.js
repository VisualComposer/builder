var Mediator = require( '../../helpers/Mediator' ); // need to remove too

var Store = {
	data: []
};
Mediator.installTo(Store);
Store.subscribe('store:add', function(element){
	var elements = Store.data;
	Store.data = elements.concat([element]);
});
module.exports = Store;
