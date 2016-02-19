var React = require('react');
var ReactDOM = require('react-dom');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too

var Navbar = require( './Navbar' );

var NavbarContainer = React.createClass(Mediator.installTo({
  getInitialState() {
    return {
      showOverlay: false,
      showGuideline: false,
      navbarPosition: 'top',
      isDragging: false
    };
  },

  componentDidMount: function () {
    document.addEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart, false );
    document.addEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd, false );
    document.addEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging, false );
  },

  componentWillUnmount: function () {
    document.removeEventListener('vc.ui.navbar.drag-start', this.handleNavbarDragStart );
    document.removeEventListener('vc.ui.navbar.drag-end', this.handleNavbarDragEnd );
    document.removeEventListener('vc.ui.navbar.dragging', this.handleNavbarDragging );
  },

  handleNavbarDragStart: function (e) {
    //console.log('vc.ui.navbar.drag-start', e.target.classList);
    this.setState({
      isDragging: true,
      showOverlay: true
    });
  },
  handleNavbarDragEnd: function (e) {
    //console.log('vc.ui.navbar.drag-end', e.target.classList);
    this.setState({
      isDragging: false,
      showOverlay: false
    });
  },
  handleNavbarDragging: function (e) {
    console.log('vc.ui.navbar.dragging');

    if ( e.eventData.navPosY - e.eventData.navbarHeight / 2 < e.eventData.navbarHeight
      && e.eventData.navPosY - e.eventData.navbarHeight / 2 >= e.eventData.navbarHeight / 2 ) {
      this.setState({
        showGuideline: true
      });
      console.log(
        document.body
      )
      document.body.style.paddingTop = this.state.navbarHeight+'px';
    } else {
      this.setState({
        showGuideline: false
      });
    }

  },

  render: function() {
    let {showOverlay, navbarPosition, isDragging, showGuideline} = this.state;

    return (
      <div id="vc-navbar-container">
        {(() => {
          if (showOverlay) {
            return <div className="vc-ui-navbar-overlay"></div>
          }
        })()}
        {(() => {
          if (isDragging) {

            let guidelineClasses = ["vc-ui-navbar-guideline", "vc-ui-navbar-guideline-" + navbarPosition];

            if (showGuideline) {
              guidelineClasses.push('vc-ui-navbar-guideline-is-visible')
            }


            guidelineClasses = guidelineClasses.join(' ');
            return <div className={guidelineClasses}></div>
          }
        })()}
        <Navbar/>
      </div>
    );
  }
}));
module.exports = (NavbarContainer);

// Here comes wrapper for navbar
var editorWrapper = document.createElement( 'div' );
editorWrapper.setAttribute( 'id', 'vc-editor-container' );
document.body.appendChild( editorWrapper );

ReactDOM.render(
  <NavbarContainer/>,
  editorWrapper
);
