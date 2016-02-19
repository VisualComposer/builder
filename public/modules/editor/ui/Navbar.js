var React = require( 'react' );
var ReactDOM = require('react-dom');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var TreeElement = require( '../layouts/tree/TreeLayout' );
var AddElementModal = require( './add-element/AddElement.js' );
var classNames = require( 'classnames' );
require( './less/navbar_old/navbar-init.less' );
require( './less/navbar/init.less' );


var Navbar = React.createClass( Mediator.installTo( {
  getInitialState: function () {
    return {
      saving: false,
      saved: false,
      isDragging: false,
      isDetached: false,
      navbarPosition: 'right',
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
  componentDidMount: function () {

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

  openAddElement: function ( e ) {
    e && e.preventDefault();
    this.publish( 'app:add', 'vc-v-root-element' );
  },
  clickSaveData: function () {
    var _this = this;
    this.setState( {'saving': true} );
    setTimeout( function (  ) {
      _this.setState( {'saving': false} );
      _this.setState( {'saved': true} );
    }, 3000 );
    setTimeout( function (  ) {
      _this.setState( {'saved': false} );
    }, 5000 );
    this.publish( 'app:save', true );
  },

  render: function () {
    var saveButtonClasses = classNames( {
      "vc-ui-navbar-control": true,
      "vc-ui-state-success": this.state.saved
    } );
    var saveIconClasses = classNames( {
      "vc-ui-navbar-control-icon": true,
      "vc-ui-wp-spinner": this.state.saving,
      "vc-ui-icon": !this.state.saving,
      "vc-ui-icon-save": !this.state.saving
    } );

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
          <a className="vc-ui-navbar-logo" title="Visual Composer" href="http://vc.wpbakery.com/?utm_campaign=VCplugin&amp;utm_source=vc_user&amp;utm_medium=frontend_editor" target="_blank">
            <span className="vc-ui-navbar-logo-title">Visual Composer</span>
          </a>
          <a className="vc-ui-navbar-control" href="#" title="Add Element" onClick={this.openAddElement}><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-add"></i><span>Add Element</span></span></a>
          <a className="vc-ui-navbar-control" href="#" title="Template"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-template"></i><span>Template</span></span></a>


          <dl className="vc-ui-navbar-dropdown">
            <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Tree View">
              <span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-layers"></i><span>Tree View</span></span>
            </dt>
            <dd className="vc-ui-navbar-dropdown-content vc-ui-navbar-show-labels">
              <TreeElement/>
            </dd>
          </dl>

          <div className="vc-ui-navbar-controls-group vc-ui-navbar-hidden-sm">
            <a className="vc-ui-navbar-control" href="#" title="Undo"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-undo"></i><span>Undo</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Redo" disabled><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-redo"></i><span>Redo</span></span></a>
          </div>
          <dl className="vc-ui-navbar-dropdown vc-ui-navbar-dropdown-linear vc-ui-navbar-hidden-sm vc-ui-pull-end">
            <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Desktop">
              <span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-desktop"></i></span>
            </dt>
            <dd className="vc-ui-navbar-dropdown-content">
              <div className="vc-ui-navbar-controls-group">
                <a className="vc-ui-navbar-control" href="#" title="Desktop"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-desktop"></i></span></a>
                <a className="vc-ui-navbar-control" href="#" title="Tablet Landscape"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-tablet-landscape"></i></span></a>
                <a className="vc-ui-navbar-control" href="#" title="Tablet Portrait"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-tablet-portrait"></i></span></a>
                <a className="vc-ui-navbar-control" href="#" title="Mobile Landscape"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-landscape"></i></span></a>
                <a className="vc-ui-navbar-control" href="#" title="Mobile Portrait"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-portrait"></i></span></a>
              </div>
            </dd>
          </dl>
          <a className="vc-ui-navbar-control vc-ui-badge-warning vc-ui-pull-end" href="#" title="Settings"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-cog"></i><span>Settings</span></span></a>
          <span className="vc-ui-navbar-control-separator vc-ui-pull-end"></span>
          <div className="vc-ui-navbar-controls-group vc-ui-pull-end">
            <a className={saveButtonClasses} href="#" title="Save" onClick={this.clickSaveData}><span className="vc-ui-navbar-control-content">
              <i className={saveIconClasses}></i><span>Save</span>
            </span></a>
          </div>
          <dl className="vc-ui-navbar-dropdown vc-ui-pull-end">
            <dt className="vc-ui-navbar-dropdown-trigger vc-ui-navbar-control" title="Menu">
              <span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-mobile-menu"></i><span>Menu</span></span>
            </dt>
            <dd className="vc-ui-navbar-dropdown-content vc-ui-navbar-show-labels">
              <div className="vc-ui-navbar-controls-group">
                <a className="vc-ui-navbar-control" href="#" title="Save as draft"><span className="vc-ui-navbar-control-content">Save as draft</span></a>
                <a className="vc-ui-navbar-control" href="#" title="View page"><span className="vc-ui-navbar-control-content">View page</span></a>
                <a className="vc-ui-navbar-control" href="#" title="Backend editor"><span className="vc-ui-navbar-control-content">Backend editor</span></a>
                <a className="vc-ui-navbar-control" href="#" title="WPB Dashboard"><span className="vc-ui-navbar-control-content">WPB Dashboard</span></a>
                <a className="vc-ui-navbar-control" href="#" title="WordPress Admin"><span className="vc-ui-navbar-control-content">WordPress Admin</span></a>
              </div>
            </dd>
          </dl>
        </nav>
        <AddElementModal/>
      </div>
    );
  }
} ) );

module.exports = Navbar;