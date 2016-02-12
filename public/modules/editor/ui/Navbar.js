var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var TreeElement = require( '../layouts/tree/TreeLayout' );
var AddElementModal = require( './add-element/AddElement.js' );
var classNames = require( 'classnames' );
require( './less/navbar_old/navbar-init.less' );
require( './less/navbar/init.less' );
var Navbar = React.createClass( Mediator.installTo( {
  getInitialState: function () {
    return {
      startMove: false,
      menuExpand: false,
      vertical: false,
      position: 0,
      saving: false,
      saved: false
    }
  },
  componentDidMount: function () {
    this.subscribe( 'layout:tree', function () {
      this.setState( { menuExpand: true } );
    }.bind( this ) );
  },
  openAddElement: function ( e ) {
    e && e.preventDefault();
    this.publish( 'app:add', 'vc-v-root-element' );
  },
  clickMenuExpand: function () {
    this.setState( { menuExpand: ! this.state.menuExpand } );
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
  changePosition: function ( e ) {
    if ( this.setState( { startMove: true } ) ) {
      ;
    }
    document.body.addEventListener( 'mouseup', this.cancelPositionChange );
    document.body.addEventListener( 'mousemove', this.checkMouseMove );
  },
  checkMouseMove: function ( e ) {
    if ( this.state.startMove ) {
      if ( e.stopPropagation ) {
        e.stopPropagation();
      }
      if ( e.preventDefault ) {
        e.preventDefault();
      }
      e.cancelBubble = true;
      e.returnValue = false;
      if ( this.state.position > 30 ) {
        this.cancelPositionChange();
        this.setState( { vertical: ! this.state.vertical } );
      } else {
        this.setState( { position: this.state.position + 1 } )
      }
    }
    return false;
  },
  cancelPositionChange: function () {
    document.body.removeEventListener( 'mouseup', this.cancelPositionChange );
    document.body.removeEventListener( 'mousemove', this.checkMouseMove );
    if ( this.setState( { startMove: false } ) ) {
      ;
    }
    this.setState( { position: 0 } );
  },
  render: function () {
    var menuExpandClass = classNames( {
      'dropdown': true,
      'open': this.state.menuExpand
    } );
    var mainCssClasses = classNames( {
      'navbar': true,
      'navbar-vc': true,
      'navbar-fixed-top': true,
      'vcv-navbar-vertical': this.state.vertical
    } );
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
    var navStyle = {
      top: this.state.position > 5 ? this.state.position + 'px' : 0,
      left: this.state.position > 5 ? this.state.position + 'px' : 0
    };
    var placeholderClasses = classNames( {
      'vcv-navbar-placeholder': true,
      'vcv-vertical': ! this.state.vertical
    } );
    var Placeholder = (this.state.position > 5 && this.state.startMove ?
      <div className={placeholderClasses}></div> : null);
    return (
      <div className="vc-ui-navbar-container">
        <nav className="vc-ui-navbar vc-ui-navbar-hide-labels">
          <div className="vc-ui-navbar-drag-handler"><i className="vc-ui-navbar-drag-handler-icon vc-ui-icon vc-ui-icon-drag-dots"></i></div>
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

          <div className="vc-ui-navbar-controls-group">
            <a className="vc-ui-navbar-control" href="#" title="Undo"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-undo"></i><span>Undo</span></span></a>
            <a className="vc-ui-navbar-control" href="#" title="Redo"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-redo"></i><span>Redo</span></span></a>
          </div>
          <dl className="vc-ui-navbar-dropdown vc-ui-navbar-dropdown-linear vc-ui-pull-right">
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
          <a className="vc-ui-navbar-control vc-ui-badge-warning vc-ui-pull-right" href="#"><span className="vc-ui-navbar-control-content"><i className="vc-ui-navbar-control-icon vc-ui-icon vc-ui-icon-cog"></i><span>Settings</span></span></a>
          <div className="vc-ui-navbar-controls-group vc-ui-pull-right">
            <a className={saveButtonClasses} href="#" title="Save" onClick={this.clickSaveData}><span className="vc-ui-navbar-control-content">
              <i className={saveIconClasses}></i><span>Save</span>
            </span></a>
          </div>
          <dl className="vc-ui-navbar-dropdown vc-ui-pull-right">
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



      //<nav className={mainCssClasses}
      //     onMouseDown={this.changePosition}
      //     style={navStyle}>
      //  {Placeholder}
      //  <div className="navbar-header">
      //    <a className="navbar-brand"><span className="vcv-logo"></span></a>
      //  </div>
      //  <ul className="nav navbar-nav">
      //    <li><a className="as_btn" onClick={this.openAddElement}><span className="glyphicon glyphicon-plus"></span></a>
      //    </li>
      //    <li role="presentation" className={menuExpandClass}>
      //      <a className="dropdown-toggle as_btn" href="#" onClick={this.clickMenuExpand}>
      //        <span className="glyphicon glyphicon-align-justify"></span> <span className="caret"></span>
      //      </a>
      //      <TreeElement/>
      //    </li>
      //  </ul>
      //  <div className="vcv-navbar-right-block">
      //    <ul className="nav navbar-nav pull-right" style={{marginRight: this.state.vertical ? null : 10 + 'px'}}>
      //      <li>
      //        <button type="button" className="btn btn-success navbar-btn" onClick={this.clickSaveData}>Update</button>
      //      </li>
      //    </ul>
      //  </div>
      //  <div className="vc_ui-inline-editor-container"></div>
      //  <AddElementModal/>
      //</nav>
    );
  }
} ) );
// Here comes wrapper for navbar
document.querySelector( 'body' ).classList.add( 'vc-ui-has-navbar' );
var editorWrapper = document.createElement( 'div' );
editorWrapper.setAttribute( 'id', 'vc-editor-container' );
var navbarWrapper = document.createElement( 'div' );
navbarWrapper.setAttribute( 'id', 'vc-navbar-container' );
editorWrapper.appendChild( navbarWrapper );
document.body.appendChild( editorWrapper );
ReactDOM.render(
  <Navbar/>,
  navbarWrapper
);
module.exports = Navbar;