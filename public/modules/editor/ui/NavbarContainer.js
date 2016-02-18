var React = require('react');
var ReactDOM = require('react-dom');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var Navbar = require( './Navbar' );

var NavbarContainer = React.createClass(Mediator.installTo({

  componentDidMount: function () {
    console.log('component mounded');
    window.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart, false );
  },

  handleNavbarDragStart: function (e) {
    console.log('vc-ui-navbar-drag-start', e);
  },
  handleNavbarDragEnd: function (e) {
    console.log('vc-ui-navbar-drag-end', e);
  },
  handleNavbarDraging: function (e) {
    console.log('vc-ui-navbar-dragging', e);
  },

  componentWillUnmount: function () {
    console.log('component unmounted');
  },
  handleDragStart(data) {
    console.log('parent', data);
  },

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
document.body.classList.add( 'vc-ui-navbar-position-top' );

var editorWrapper = document.createElement( 'div' );
editorWrapper.setAttribute( 'id', 'vc-editor-container' );
document.body.appendChild( editorWrapper );

ReactDOM.render(
  <NavbarContainer/>,
  editorWrapper
);
