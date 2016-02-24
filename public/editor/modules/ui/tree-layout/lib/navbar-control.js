var vcCake = require('vc-cake');
vcCake.add('ui-tree-layout', function(api){
  var Layout = require('./layout');
  var React = require('react');
  var classNames = require('classnames');
  var Control = React.createClass({
    getInitialState: function() {
      return {
        menuExpand: false
      };
    },
    clickMenuExpand: function () {
      this.setState({menuExpand: !this.state.menuExpand});
    },
    render: function(){
      var menuExpandClass = classNames({
        'dropdown': true,
        'open': this.state.menuExpand
      });
      return <li role="presentation" className={menuExpandClass}>
        <a className="dropdown-toggle as_btn" href="#" onClick={this.clickMenuExpand}>
          <span className="glyphicon glyphicon-align-justify"></span> <span className="caret"></span>
        </a>
        <Layout/>
      </li>;
    }
  });
  api.module('ui-navbar').do('addElement', 'Tree layout', Control, 'left');
});

