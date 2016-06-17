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
    let nameClasses = classNames({
      'vcv-ui-add-element-element-name': true,
      'vcv-ui-text-badge-success': true,
      'vcv-ui-text-badge-warning': false
    })

    return <li className='vcv-ui-add-element-list-item'>
      <a className='vcv-ui-add-element-element' onClick={this.addElement}>
        <span className='vcv-ui-add-element-element-content'>
          <img src='https://placehold.it/100x100'
            className='vcv-ui-add-element-overlay vcv-ui-add-element-element-image'
            height='100'
            width='100'
            alt='' />
          <span className='vcv-ui-add-element-overlay vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add'></span>
          <span className='vcv-ui-add-element-overlay vcv-ui-add-element-edit'>
            <span className='vcv-ui-add-element-move vcv-ui-icon vcv-ui-icon-drag-dots'></span>
            <span className='vcv-ui-add-element-remove vcv-ui-icon vcv-ui-icon-close'></span>
          </span>
        </span>
        <span className={nameClasses}>
          {this.props.name}
        </span>
      </a>
    </li>
  }
})
