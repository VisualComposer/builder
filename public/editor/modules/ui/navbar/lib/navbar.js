var vcCake = require('vc-cake');
var React = require( 'react' );
var ReactDOM = require('react-dom');
// var TreeElement = require( '../layouts/tree/TreeLayout' );
// var AddElementModal = require( './add-element/AddElement.js' );
var classNames = require( 'classnames' );
require( '../css/navbar_old/navbar-init.less' );
require( '../css/module.less' );
var navbarControls = [];

var Navbar = React.createClass({
  getInitialState: function () {
    return {
      controlsCount: 0,
      saving: false,
      saved: false,
      isDragging: false,
      isDetached: false,
      navbarPosition: 'top',
      navbarNewPosition: undefined,
      navPosX: 0,
      navPosY: 0,
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      navbarSize: {
        height: undefined,
        width: undefined
      },
      moveDirection: {
        top: false,
        right: false,
        bottom: false,
        left: false
      }
    }
  },
  componentWillMount: function () {
    this.props.api.addAction('addElement', function(name, Icon) {
      navbarControls.push({name: name, Icon: Icon});
      this.props.api.notify('build', navbarControls.length);
    }.bind(this));
  },
  componentDidMount: function() {
    this.props.api.on('build', function(count) {
      this.setState({controlsCount: count});
    }.bind(this));
  },
  buildControls: function() {
    return navbarControls.map(function(value) {
      return React.createElement(value.Icon, {key: vcCake.getService('utils').createKey()});
    });
  },
  handleDragStart(e) {
    this.setState({
      isDragging: true,
      navbarSize: {
        height: ReactDOM.findDOMNode( this ).offsetHeight,
        width: ReactDOM.findDOMNode( this ).offsetWidth
      },
      navbarNewPosition: this.state.navbarPosition
    });


    let moveStartEvent = document.createEvent('Event');
    moveStartEvent.eventData = this.state;
    moveStartEvent.initEvent('vc.ui.navbar.drag-start', true, true);
    e.target.dispatchEvent(moveStartEvent);

    document.body.classList.add('vc-ui-navbar-is-dragging');
    document.addEventListener('mousemove', this.handleDragging);
    document.addEventListener('mouseup', this.handleDragEnd);

    this.handleDragging( e.nativeEvent );
  },

  handleDragEnd(e){
    let moveEndEvent = document.createEvent('Event');
    moveEndEvent.initEvent('vc.ui.navbar.drag-end', true, true);
    e.target.dispatchEvent(moveEndEvent);
    document.body.classList.remove('vc-ui-navbar-is-dragging');
    document.removeEventListener( 'mousemove', this.handleDragging);
    document.removeEventListener('mouseup', this.handleDragEnd);

    this.setState({
      isDragging: false
    });
  },

  handleDragging(e  ) {
    //check dirrection
    this.setState(function(previousState) {
      let newStates = {
        moveDirection: {
          left: false,
          right: false,
          top: false,
          bottom: false
        },
        navPosX: e.clientX,
        navPosY: e.clientY,
        navbarNewPosition: this.state.navbarPosition
      };

      if (previousState.navPosX > e.clientX) {
        newStates.moveDirection.left = true;
      } else if (previousState.navPosX < e.clientX) {
        newStates.moveDirection.right = true;
      }
      if (previousState.navPosY > e.clientY) {
        newStates.moveDirection.top = true;
      } else if (previousState.navPosY < e.clientY) {
        newStates.moveDirection.bottom = true;
      }

      return newStates;
    });

    let movingEvent = document.createEvent('Event');
    movingEvent.eventData = this.state;
    movingEvent.initEvent('vc.ui.navbar.dragging', true, true);
    e.target.dispatchEvent(movingEvent);

  },
  render: function () {

    let {
      isDragging,
      navPosX,
      navPosY,
      navbarPosition,
      navbarNewPosition,
      moveDirection,
      navbarSize,
      windowSize
      } = this.state,
      navBarStyle = {}, isDetached;

    if (isDragging) {
      isDetached = false;
      navBarStyle.opacity = .5;


      switch (navbarNewPosition) {
        case 'top':
          navBarStyle.top = navPosY - navbarSize.height / 2;
          if (navBarStyle.top > navbarSize.height) {
            isDetached = true;
          }
          if (moveDirection.bottom && navPosY - navbarSize.height / 2 < navbarSize.height / 2) {
            navBarStyle.top = 0;
          }
          if (moveDirection.top && navPosY - navbarSize.height / 2 < navbarSize.height / 2) {
            navBarStyle.top = 0;
          }
          if (isDetached) {
            navBarStyle.left = navPosX - 7;
          }
          break;
        case 'left':
          navBarStyle.left = navPosX - navbarSize.width / 2;
          if (navBarStyle.left > navbarSize.width) {
            isDetached = true;
          }
          if (moveDirection.right && navPosX - navbarSize.width / 2 < navbarSize.width / 2) {
            navBarStyle.left = 0;
          }
          if (moveDirection.left && navPosX - navbarSize.width / 2 < navbarSize.width / 2) {
            navBarStyle.left = 0;
          }
          if (isDetached) {
            navBarStyle.top = navPosY - 7;
          }
          break;
        case 'bottom':
          navBarStyle.bottom = windowSize.height - ( navPosY + navbarSize.height / 2) ;
          if (navBarStyle.bottom > navbarSize.height) {
            isDetached = true;
          }
          if (moveDirection.bottom && windowSize.height - (navPosY + navbarSize.height / 2) < navbarSize.height / 2) {
            navBarStyle.bottom = 0;
          }
          if (moveDirection.top && windowSize.height - (navPosY + navbarSize.height / 2 ) < navbarSize.height / 2) {
            navBarStyle.bottom = 0;
          }
          if (isDetached) {
            navBarStyle.left = navPosX - 7;
          }
          break;
        case 'right':
          navBarStyle.right = windowSize.width - (navPosX + navbarSize.width / 2);
          if (navBarStyle.right > navbarSize.width) {
            isDetached = true;
          }
          if (moveDirection.left && windowSize.width - (navPosX + navbarSize.width / 2) < navbarSize.width / 2) {
            navBarStyle.right = 0;
          }
          if (moveDirection.right && windowSize.width - ( navPosX + navbarSize.width / 2) < navbarSize.width / 2) {
            navBarStyle.right = 0;
          }
          if (isDetached) {
            navBarStyle.top = navPosY - 7;
          }
          break;
      }



    }

    let navbarContainerClasses = classNames( {
      "vc-ui-navbar-container": true,
      "vc-ui-navbar-is-detached": isDetached
    } );

    document.body.classList.add( 'vc-ui-has-navbar' );
    document.body.classList.add( 'vc-ui-navbar-position-' + navbarPosition );
    return (
      <div className={navbarContainerClasses} style={navBarStyle}>
        <nav className="vc-ui-navbar vc-ui-navbar-hide-labels">
          <div className="vc-ui-navbar-drag-handler" onMouseDown={this.handleDragStart}><i className="vc-ui-navbar-drag-handler-icon vc-ui-icon vc-ui-icon-drag-dots"></i></div>
          {this.buildControls()}
        </nav>
      </div>
    );
  }
});

module.exports = Navbar;