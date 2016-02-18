var React = require('react');
var ReactDOM = require('react-dom');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var Navbar = require( './Navbar' );

var NavbarContainer = React.createClass(Mediator.installTo({
  getInitialState() {
    return {
      showOverlay: false
    };
  },

  componentDidMount: function () {
    console.log('component mounded');
    window.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart, false );
    window.addEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd, false );
    window.addEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging, false );
  },

  componentWillUnmount: function () {
    window.removeEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart );
    window.removeEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd );
    window.removeEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging );
  },

  handleNavbarDragStart: function (e) {
    console.log('vc-ui-navbar-drag-start', e.target.classList);
    this.setState({
      showOverlay: true
    });
  },
  handleNavbarDragEnd: function (e) {
    console.log('vc-ui-navbar-drag-end', e.target.classList);
    this.setState({
      showOverlay: false
    });
  },
  handleNavbarDragging: function (e) {
    console.log('vc-ui-navbar-dragging', e.target.classList);
  },
  handleDragStart(data) {
    console.log('parent', data);
  },

  render: function() {
    let {showOverlay} = this.state;

    return (
      <div  id="vc-navbar-container">
        <Navbar/>
        {(() => {
          if (showOverlay) {
            return <div className="vc-ui-navbar-overlay"></div>
          }
        })()}
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
