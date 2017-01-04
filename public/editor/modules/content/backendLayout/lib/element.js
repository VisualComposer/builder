/* eslint react/jsx-no-bind: "off" */
import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'

const cook = vcCake.getService('cook')
const categoriesService = vcCake.getService('categories')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.bool ]),
    data: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.array ]),
    api: React.PropTypes.object.isRequired,
    level: React.PropTypes.number,
    iframe: React.PropTypes.any
  }

  static defaultProps = {
    iframe: '' // document.getElementById('vcv-editor-iframe').contentWindow.document
  }

  constructor (props) {
    super(props)

    this.state = {
      childExpand: true,
      isActive: false,
      hasChild: false,
      showOutline: false
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleOutline = this.handleOutline.bind(this)
    this.checkActive = this.checkActive.bind(this)
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
    this.props.api
      .reply('app:edit', this.checkActive)
      .reply('app:add', this.checkActive)
      .reply('data:add', this.checkActive)
      .on('hide', this.checkActive)
      .on('form:hide', this.checkActive)
    vcCake.onDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)
  }

  componentWillUnmount () {
    this.props.api
      .forget('app:edit', this.checkActive)
      .forget('app:add', this.checkActive)
      .forget('data:add', this.checkActive)
      .off('hide', this.checkActive)
      .off('form:hide', this.checkActive)
    vcCake.ignoreDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)
    // should put after unmount component
    this.props.api.notify('element:unmount', this.props.element.id)
  }

  checkActive (data = false) {
    if (this.state.isActive !== (data === this.props.element.id)) {
      this.setState({
        isActive: data === this.props.element.id
      })
    }
  }

  handleOutline (outlineElementId) {
    let showOutline = outlineElementId === this.props.element.id
    if (this.state.showOutline !== showOutline) {
      this.setState({
        showOutline: showOutline
      })
    }
  }

  clickChildExpand = () => {
    this.setState({ childExpand: !this.state.childExpand })
  }

  clickAddChild (tag) {
    this.props.api.request('app:add', this.props.element.id, tag)
  }

  clickClone = (e) => {
    e && e.preventDefault()
    this.props.api.request('data:clone', this.props.element.id)
  }

  clickEdit = (tab = '') => {
    this.props.api.request('app:edit', this.props.element.id, tab)
  }

  clickDelete = (e) => {
    e && e.preventDefault()
    this.props.api.request('data:remove', this.props.element.id)
  }

  getContent () {
    if (this.props.data.length) {
      let level = this.props.level + 1
      const DocumentData = vcCake.getService('document')
      let elementsList = this.props.data.map((element) => {
        let data = DocumentData.children(element.id)
        return <Element element={element} data={data} key={element.id} level={level} api={this.props.api} />
      }, this)
      return <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul>
    }
    return ''
  }

  handleMouseEnter (e) {
    if (e.currentTarget.parentNode.dataset && e.currentTarget.parentNode.dataset.hasOwnProperty('vcvElement')) {
      this.props.api.request('treeContent:element:mouseEnter', e.currentTarget.parentNode.dataset.vcvElement)
    }
  }

  handleMouseLeave (e) {
    if (e.currentTarget.parentNode.dataset && e.currentTarget.parentNode.dataset.hasOwnProperty('vcvElement')) {
      this.props.api.request('treeContent:element:mouseLeave', e.currentTarget.parentNode.dataset.vcvElement)
    }
  }

  render () {
    let element = cook.get(this.props.element)
    let treeChildClasses = classNames({
      'vcv-ui-tree-layout-node-child': true,
      'vcv-ui-tree-layout-node-expand': this.state.childExpand,
      'vcv-ui-tree-layout-node-state-draft': false
    })

    let child = this.getContent()

    this.state.hasChild = !!child

    let addChildControl = false
    let editRowLayoutControl = false
    if (element.containerFor().length) {
      let title = 'Add Element'
      let addElementTag = ''
      let children = cook.getChildren(this.props.element.tag)
      if (children.length === 1) {
        title = `Add ${children[ 0 ].name}`
        addElementTag = children[ 0 ].tag
      }
      addChildControl = (
        <a className='vcv-ui-tree-layout-control-action' title={title}
          onClick={this.clickAddChild.bind(this, addElementTag)}>
          <i className='vcv-ui-icon vcv-ui-icon-add-thin' />
        </a>
      )
      if (this.props.element.tag === 'row') {
        editRowLayoutControl = <a className='vcv-ui-tree-layout-control-action' title='Row Layout'
          onClick={this.clickEdit.bind(this, 'layout')}>
          <i className='vcv-ui-icon vcv-ui-icon-row-layout' />
        </a>
      }
    }

    let expandTrigger = ''
    if (this.state.hasChild) {
      expandTrigger = (
        <i className='vcv-ui-tree-layout-node-expand-trigger vcv-ui-icon vcv-ui-icon-expand'
          onClick={this.clickChildExpand} />
      )
    }

    let childControls = <span className='vcv-ui-tree-layout-control-actions'>
      {addChildControl}
      {editRowLayoutControl}
      <a className='vcv-ui-tree-layout-control-action' title='Edit' onClick={this.clickEdit.bind(this, '')}>
        <i className='vcv-ui-icon vcv-ui-icon-edit' />
      </a>
      <a className='vcv-ui-tree-layout-control-action' title='Clone' onClick={this.clickClone}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </a>
      <a className='vcv-ui-tree-layout-control-action' title='Remove' onClick={this.clickDelete}>
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
      </a>
    </span>

    let controlClasses = classNames({
      'vcv-ui-tree-layout-control': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-state--outline': this.state.showOutline
    })

    let publicPath = categoriesService.getElementIcon(element.get('tag'))
    let space = 0.8

    return (
      <li
        className={treeChildClasses}
        data-vcv-element={this.props.element.id}
        type={element.get('type')}
        name={element.get('name')}
      >
        <div
          className={controlClasses}
          style={{ paddingLeft: (space * this.props.level + 1) + 'rem' }}
          onMouseOver={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className='vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'>
            <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
          </div>
          <div className='vcv-ui-tree-layout-control-content'>
            {expandTrigger}
            <i className='vcv-ui-tree-layout-control-icon'><img src={publicPath} className='vcv-ui-icon' alt='' /></i>
            <span className='vcv-ui-tree-layout-control-label'>
              <span>{element.get('name')}</span>
            </span>
            {childControls}
          </div>
        </div>
        {child}
      </li>
    )
  }
}
