var React = require('react');
var ReactDOM = require('react-dom');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var Navbar = require( './Navbar' );

var NavbarContainer = React.createClass(Mediator.installTo({
  render: function() {
    return (
      <div  id="vc-navbar-container">
        <Navbar/>
      </div>
    );
  }
}));
module.exports = DragDropContext(HTML5Backend)(NavbarContainer);

// Here comes wrapper for navbar
document.querySelector( 'body' ).classList.add( 'vc-ui-navbar-position-top' );

var editorWrapper = document.createElement( 'div' );
editorWrapper.setAttribute( 'id', 'vc-editor-container' );
document.body.appendChild( editorWrapper );

ReactDOM.render(
  <NavbarContainer/>,
  editorWrapper
);
