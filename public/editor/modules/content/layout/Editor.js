var React = require( 'react' );
var Mediator = require( '../.././Mediator' ); // need to remove too

var Navbar = require( './Navbar' );
var HtmlLayout = require( '../layouts/html/HtmlLayout' );
var CleanHtmlLayout = require( '../layouts/cleanhtml/CleanHtmlLayout' );
var EditForm = require('./edit-form/EditForm');
var Editor = React.createClass(Mediator.installTo({
    render: function () {
        return (
            <div className="vc-editor-here">
                <EditForm/>
                <HtmlLayout/>
                <CleanHtmlLayout/>
            </div>
        );
    }
}));
ReactDOM.render(
  <Editor />,
  document.getElementById('vc_v-editor')
);