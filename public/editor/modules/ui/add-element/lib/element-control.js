var vcCake = require('vc-cake')
var cook = vcCake.getService('cook')
var React = require('react')
var classNames = require('classnames')

module.exports = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    api: React.PropTypes.object.isRequired,
    icon: React.PropTypes.string
  },
  addElement: function (e) {
    e.preventDefault()
    var data = cook.get({ tag: this.props.tag, parent: this.props.api.actions.getParent() })
    this.props.api.request('data:add', data.toJS(true))
    this.props.api.notify('hide', true)
  },
  render: function () {
    let classes = classNames('vcv-ui-add-element-element')

    return <li>
      <a className={classes} onClick={this.addElement}>
        <span>
          {this.props.name}
        </span>
      </a>
    </li>
  }
})
