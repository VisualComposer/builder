var React = require( 'react' );
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var Navbar = require( './Navbar' );
var HtmlLayout = require( '../layouts/html/HtmlLayout' );
var EditForm = require('./edit-form/EditForm');
require('./Editor.css');
var Editor = React.createClass(Mediator.installTo({
    render: function () {
        return (
            <div className="vc-editor-here">
                <EditForm/>
                <HtmlLayout/>
            </div>
        );
    }
}));
module.exports = Editor;