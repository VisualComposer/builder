var React = require( 'react' );
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var Navbar = require( './Navbar' );
var HtmlLayout = require( '../layouts/html/HtmlLayout' );
// var TreeLayout = require( './layouts/tree/TreeLayout' );
// var DataLayout = require( './layouts/data/DataLayout' );
require('./Editor.css');
// @todo use mixins logic by module to interact with modules. Big object as Mediator connected with objects as mixins :)
var DataChanged = {
    componentDidMount: function(){
        this.subscribe('data:changed', function(document) {
            this.setState({data: document});
        }.bind(this));
    }
};
var reactObject = {
    mixins: [DataChanged],
    getInitialState: function () {
        return {
            data: {}
        };
    },
    render: function () {
        return (
            <div>
                <Navbar data={this.state.data}/>
                <HtmlLayout data={this.state.data}/>
            </div>
        );
    }
};
Mediator.installTo(reactObject);
var Editor = React.createClass( reactObject );
module.exports = Editor;