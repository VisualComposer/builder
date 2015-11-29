var React = require( 'react' );
var App = require( '../modules/editor/App.js' );
var Store = require('../modules/store/Store.js');

App.subscribe('app:mounted', function(){
	App.subscribe( 'store:add', function (element) {
		var elements = this.state.data;
		var newElements = elements.concat([element]);
		this.setState( { data: newElements } );
	}.bind(this));
});