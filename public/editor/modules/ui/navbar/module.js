var vcCake = require('vc-cake');

vcCake.add('ui-navbar', function(api) {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var classNames = require('classnames');
  require('./css/navbar-init.less');
  var navbarControls = [];
  /**
   * @var {string} position - possible values: header, left, right;
   */
  api.addAction('addElement', function(name, Icon, position) {
    navbarControls.push({name: name, Icon: Icon, position: position});
    api.notify('build', navbarControls.length);
  });
  var Navbar = React.createClass({
    getInitialState: function() {
      return {
        controlsCount: 0,
        state: true,
        startMove: false,
        vertical: false,
        position: 0
      }
    },
    componentDidMount: function() {
      api.on('build', function(count) {
        this.setState({controlsCount: count});
      }.bind(this));
    },
    changePosition: function(e) {
      if (this.setState({startMove: true}));
      document.body.addEventListener('mouseup', this.cancelPositionChange);
      document.body.addEventListener('mousemove', this.checkMouseMove);
    },
    checkMouseMove: function(e) {
      if (this.state.startMove) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        if (this.state.position > 30) {
          this.cancelPositionChange();
          this.setState({vertical: !this.state.vertical});
        } else {
          this.setState({position: this.state.position + 1})
        }
      }
      return false;
    },
    cancelPositionChange: function() {
      document.body.removeEventListener('mouseup', this.cancelPositionChange);
      document.body.removeEventListener('mousemove', this.checkMouseMove);
      if (this.setState({startMove: false}));
      this.setState({position: 0});
    },
    buildControls: function(position) {
      console.log(navbarControls);
      return navbarControls.filter(function(value) {
        return value.position === position;
      }).map(function(value) {
        var Element = React.createElement(value.Icon, {key: vcCake.getService('utils').createKey()});
        if('header' !== value.position) {
          return <li key={vcCake.getService('utils').createKey()}>{Element}</li>;
        }
        return Element;
      });
    },
    render: function() {
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
      var Placeholder = (this.state.position > 5 && this.state.startMove ?
        <div className={placeholderClasses}></div> : null);
      return (
        <nav className={mainCssClasses}
             style={navStyle}>
          {Placeholder}
          <div className="navbar-header">
            {this.buildControls('header')}
          </div>
          <ul className="nav navbar-nav">
            {this.buildControls('left')}
          </ul>
          <div className="vcv-navbar-right-block">
            <ul className="nav navbar-nav pull-right" style={{marginRight: this.state.vertical ? null : 10 + 'px'}}>
              {this.buildControls('right')}
            </ul>
          </div>
          <div className="vc_ui-inline-editor-container"></div>
        </nav>
      );
    }
  });
// Here comes wrapper for navbar
  var navbarWrapper = document.createElement('div');
  navbarWrapper.setAttribute('id', 'vc-navbar-container');
  document.body.appendChild(navbarWrapper);
  ReactDOM.render(
    <Navbar/>,
    navbarWrapper
  );

});
