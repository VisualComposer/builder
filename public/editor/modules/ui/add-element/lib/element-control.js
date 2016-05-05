var vcCake = require('vc-cake');
var cook = vcCake.getService('cook');
var React = require('react');
var classNames = require('classnames');

module.exports = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },
  addElement: function(e) {
    e.preventDefault();
    var document = this.props.api.getService('document');
    var data = cook.get({tag: this.props.tag});
    // Add element node
    data.parent = this.props.api.actions.getParent();
    this.props.api.request('data:add', data.toJS());
  },
  render: function() {
    var className;

    if (this.props.icon) {
      className = classNames('glyphicon', this.props.icon);
    }

    return <li key={this.props.key}>
      <a onClick={this.addElement}>
        { this.props.icon ? <span className={className}></span> : null}
        {this.props.name}
      </a>
    </li>;
  }
});
