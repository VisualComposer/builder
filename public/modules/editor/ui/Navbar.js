var React = require('react');
var Mediator = require('../../../helpers/Mediator'); // need to remove too
var TreeElement = require('../layouts/tree/TreeLayout');
var AddElementModal = require('./add-element/AddElement.js');
var classNames = require('classnames');
require('./less/navbar/navbar-init.less');
module.exports = React.createClass(Mediator.installTo({
  getInitialState: function () {
    return {
      startMove: false,
      menuExpand: false,
      vertical: false,
      position: 0
    }
  },
  componentDidMount: function () {
    this.subscribe('layout:tree', function () {
      this.setState({menuExpand: true});
    }.bind(this));
  },
  openAddElement: function (e) {
    e && e.preventDefault();
    this.publish('app:add', 'vc-v-root-element');
  },
  clickMenuExpand: function () {
    this.setState({menuExpand: !this.state.menuExpand});
  },
  clickSaveData: function () {
    this.publish('app:save', true);
  },
  changePosition: function (e) {
    if (this.setState({startMove: true}));
    document.body.addEventListener('mouseup', this.cancelPositionChange);
    document.body.addEventListener('mousemove', this.checkMouseMove);
  },
  checkMouseMove: function (e) {
    if (this.state.startMove) {
      if(e.stopPropagation) e.stopPropagation();
      if(e.preventDefault) e.preventDefault();
      e.cancelBubble=true;
      e.returnValue=false;
      if (this.state.position > 30) {
        this.cancelPositionChange();
        this.setState({vertical: !this.state.vertical});
      } else {
        this.setState({position: this.state.position + 1})
      }
    }
    return false;
  },
  cancelPositionChange: function () {
    document.body.removeEventListener('mouseup', this.cancelPositionChange);
    document.body.removeEventListener('mousemove', this.checkMouseMove);
    if (this.setState({startMove: false}));
    this.setState({position: 0});
  },
  render: function () {
    var menuExpandClass = classNames({
      'dropdown': true,
      'open': this.state.menuExpand
    });
    var mainCssClasses = classNames({
      'navbar': true,
      'navbar-vc': true,
      'navbar-fixed-top': true,
      'vcv-navbar-vertical': this.state.vertical
    });
    var navStyle = {
      top: this.state.position > 5 ? this.state.position + 'px' : 0,
      left: this.state.position > 5 ? this.state.position + 'px' : 0
    };
    var placeholderClasses = classNames({
      'vcv-navbar-placeholder': true,
      'vcv-vertical': !this.state.vertical
    });
    var Placeholder = (this.state.position > 5 && this.state.startMove ? <div className={placeholderClasses}></div> : null);
    return (
      <nav className={mainCssClasses}
           onMouseDown={this.changePosition}
           style={navStyle}>
        {Placeholder}
        <div className="navbar-header">
          <a className="navbar-brand"><span className="vcv-logo"></span></a>
        </div>
        <ul className="nav navbar-nav">
          <li><a className="as_btn" onClick={this.openAddElement}><span className="glyphicon glyphicon-plus"></span></a>
          </li>
          <li role="presentation" className={menuExpandClass}>
            <a className="dropdown-toggle as_btn" href="#" onClick={this.clickMenuExpand}>
              <span className="glyphicon glyphicon-align-justify"></span> <span className="caret"></span>
            </a>
            <TreeElement/>
          </li>
        </ul>
        <div className="vcv-navbar-right-block">
          <ul className="nav navbar-nav pull-right" style={{marginRight: this.state.vertical ? null : 10 + 'px'}}>
            <li>
              <button type="button" className="btn btn-success navbar-btn" onClick={this.clickSaveData}>Update</button>
            </li>
          </ul>
        </div>
        <div className="vc_ui-inline-editor-container"></div>
        <AddElementModal/>
      </nav>
    );
  }
}));