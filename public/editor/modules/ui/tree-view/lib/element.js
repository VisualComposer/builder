/*eslint jsx-quotes: [2, "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
var cook = vcCake.getService('cook')
var classNames = require('classnames')

var Element = React.createClass({
  propTypes: {
    element: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.bool ]),
    data: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.array ]),
    api: React.PropTypes.object.isRequired,
    level: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      childExpand: true,
      elementId: null,
      hasChild: false
    }
  },
  clickChildExpand: function () {
    this.setState({ childExpand: !this.state.childExpand })
  },
  clickAddChild: function (e) {
    e && e.preventDefault()
    this.props.api.request('app:add', this.props.element.id)
  },
  clickClone: function (e) {
    e && e.preventDefault()
    this.props.api.request('data:clone', this.props.element.id)
  },
  clickEdit: function (e) {
    e && e.preventDefault()
    this.props.api.request('app:edit', this.props.element.id)
  },
  clickDelete: function (e) {
    e && e.preventDefault()
    this.props.api.request('data:remove', this.props.element.id)
  },
  getContent: function () {
    if (this.props.data.length) {
      let level = this.props.level + 1
      let document = vcCake.getService('document')
      let elementsList = this.props.data.map(function (element) {
        let data = document.children(element.id)
        return <Element element={element} data={data} key={element.id} level={level} api={this.props.api} />
      }, this)
      return <ul className="vcv-ui-tree-layout-node">{elementsList}</ul>
    }
    return ''
  },
  componentDidMount: function () {
    this.props.api.notify('element:mount', this.props.element.id)

    this.props.api
      .reply('app:edit', (id) => {
        this.setState({ elementId: id })
      })
      .reply('app:add', (id) => {
        this.setState({ elementId: id })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({ elementId: null })
      })
      .on('hide', () => {
        this.setState({ elementId: null })
      })
      .on('form:hide', () => {
        this.setState({ elementId: null })
      })
  },
  componentWillUnmount: function () {
    this.props.api.notify('element:unmount', this.props.element.id)
  },
  getPublicPath (file) {
    let defaultPath = window.vcvPluginUrl + 'sources/elements-2/' + this.props.element.tag + '/public'
    let $element = document.querySelector('[data-vc-element-script="' + this.props.element.tag + '"]')
    if ($element) {
      defaultPath = $element.dataset.vcElementUrl + '/public'
    }
    if (file) {
      defaultPath += '/' + file
    }
    return defaultPath
  },
  render: function () {
    let element = cook.get(this.props.element)

    let treeChildClasses = classNames({
      'vcv-ui-tree-layout-node-child': true,
      'vcv-ui-tree-layout-node-expand': this.state.childExpand,
      'vcv-ui-tree-layout-node-state-draft': false
    })

    let child = element.get('type') === 'container' ? this.getContent() : ''

    this.state.hasChild = !!child

    let addChildControl = false
    if (element.get('type') === 'container') {
      addChildControl = <a className="vcv-ui-tree-layout-control-action" title="Add" onClick={this.clickAddChild}>
        <i className="vcv-ui-icon vcv-ui-icon-add-thin"></i>
      </a>
    }

    let expandTrigger = ''
    if (this.state.hasChild) {
      expandTrigger = (
        <i className="vcv-ui-tree-layout-node-expand-trigger vcv-ui-icon vcv-ui-icon-expand"
          onClick={this.clickChildExpand} />
      )
    }

    let childControls = <span className="vcv-ui-tree-layout-control-actions">
      {addChildControl}
      <a className="vcv-ui-tree-layout-control-action" title="Edit" onClick={this.clickEdit}>
        <i className="vcv-ui-icon vcv-ui-icon-edit" />
      </a>
      <a className="vcv-ui-tree-layout-control-action" title="Delete" onClick={this.clickDelete}>
        <i className="vcv-ui-icon vcv-ui-icon-close-thin" />
      </a>
      <a className="vcv-ui-tree-layout-control-action" title="Clone" onClick={this.clickClone}>
        <i className="vcv-ui-icon vcv-ui-icon-copy" />
      </a>
    </span>

    let controlClasses = classNames({
      'vcv-ui-tree-layout-control': true,
      'vcv-ui-state--active': this.props.element.id === this.state.elementId
    })

    return <li className={treeChildClasses} data-vc-element={this.props.element.id} type={element.get('type')}
      name={element.get('name')}>
      <div className={controlClasses} style={{paddingLeft: this.props.level + 1 + 'em'}}>
        <div className="vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler">
          <i className="vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots" />
        </div>
        <div className="vcv-ui-tree-layout-control-content">
          {expandTrigger}
          <img src={this.getPublicPath(element.get('meta_icon'))} className="vcv-ui-tree-layout-control-icon" alt="" />
          <span className="vcv-ui-tree-layout-control-label">
            <span>{element.get('name')}</span>
          </span>
          {childControls}
        </div>
      </div>
      {child}
    </li>
  }
})
module.exports = Element
