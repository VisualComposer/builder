import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')
const documentManger = vcCake.getService('document')

const cook = vcCake.getService('cook')
// const categoriesService = vcCake.getService('categories')
const hubCategoriesService = vcCake.getService('hubCategories')

export default class TreeViewElement extends React.Component {
  static propTypes = {
    showOutlineCallback: React.PropTypes.func,
    element: React.PropTypes.object.isRequired,
    data: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.array ]),
    level: React.PropTypes.number,
    iframe: React.PropTypes.any,
    onMountCallback: React.PropTypes.func,
    onUnmountCallback: React.PropTypes.func
  }

  static defaultProps = {
    iframe: document.getElementById('vcv-editor-iframe').contentWindow.document
  }

  constructor (props) {
    super(props)

    this.state = {
      childExpand: true,
      isActive: false,
      hasChild: false,
      showOutline: false,
      element: props.element
    }

    this.scrollToElement = this.scrollToElement.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleOutline = this.handleOutline.bind(this)
    this.checkActive = this.checkActive.bind(this)
    this.dataUpdate = this.dataUpdate.bind(this)
  }
  dataUpdate (data) {
    this.setState({element: data || this.props.element})
  }
  componentWillReceiveProps (nextProps) {
    const newShowOutline = nextProps.showOutlineCallback(nextProps.element.id)
    newShowOutline !== this.state.showOutline && this.setState({showOutline: newShowOutline})
  }
  componentWillMount () {
    this.checkActive(workspaceStorage.state('settings').get())
  }
  componentDidMount () {
    elementsStorage.state('element:' + this.state.element.id).onChange(this.dataUpdate)
    this.props.onMountCallback(this.state.element.id)
    workspaceStorage.state('settings').onChange(this.checkActive)
    // vcCake.onDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)

    /*
    this.props.api.notify('element:mount', this.props.element.id)
    this.props.api
      .reply('app:edit', this.checkActive)
      .reply('app:add', this.checkActive)
      .reply('data:add', this.checkActive)
      .on('hide', this.checkActive)
      .on('form:hide', this.checkActive)
    vcCake.onDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)
    */
  }

  componentWillUnmount () {
    elementsStorage.state('element:' + this.state.element.id).ignoreChange(this.dataUpdate)
    this.props.onUnmountCallback(this.state.element.id)
    workspaceStorage.state('settings').ignoreChange(this.checkActive)
    // vcCake.ignoreDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)

    /*
    this.props.api
      .forget('app:edit', this.checkActive)
      .forget('app:add', this.checkActive)
      .forget('data:add', this.checkActive)
      .off('hide', this.checkActive)
      .off('form:hide', this.checkActive)
    vcCake.ignoreDataChange('vcv:treeLayout:outlineElementId', this.handleOutline)
    */
    // should put after unmount component
    // this.props.api.notify('element:unmount', this.props.element.id)
  }

  checkActive (data = false) {
    this.setState({
      isActive: data && data.element && data.element.id === this.props.element.id
    })
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
    workspaceStorage.trigger('add', this.state.element.id, tag)
  }

  clickClone = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('clone', this.state.element.id)
  }

  clickEdit = (tab = '') => {
    workspaceStorage.trigger('edit', this.state.element.id, tab)
  }

  clickDelete = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('remove', this.state.element.id)
  }

  getContent () {
    const {showOutlineCallback, onMountCallback, onUnmountCallback} = this.props
    const level = this.props.level + 1
    let elementsList = documentManger.children(this.state.element.id).map((element) => {
      return <TreeViewElement
        showOutlineCallback={showOutlineCallback}
        onMountCallback={onMountCallback}
        onUnmountCallback={onUnmountCallback}
        element={element}
        key={element.id}
        level={level} />
    }, this)
    return elementsList.length ? <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul> : ''
  }

  scrollToElement (e) {
    let elId = e.currentTarget.parentNode.dataset.vcvElement
    let editorEl = this.props.iframe.querySelector(`#el-${elId}`)
    let elRect = editorEl.getBoundingClientRect()
    let wh = document.getElementById('vcv-editor-iframe').contentWindow.innerHeight
    let below = elRect.bottom > wh && elRect.top > wh
    let above = elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      editorEl.scrollIntoView({behavior: 'smooth'})
    }
  }

  handleMouseEnter (e) {
    if (e.currentTarget.parentNode.dataset && e.currentTarget.parentNode.dataset.hasOwnProperty('vcvElement')) {
      workspaceStorage.state('userInteractWith').set(this.state.element.id)
    }
  }

  handleMouseLeave (e) {
    if (e.currentTarget.parentNode.dataset && e.currentTarget.parentNode.dataset.hasOwnProperty('vcvElement')) {
      workspaceStorage.state('userInteractWith').set(false)
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

    let publicPath = hubCategoriesService.getElementIcon(element.get('tag')) // TODO: Fix this
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
          // onMouseOver={this.handleMouseEnter}
          // onMouseLeave={this.handleMouseLeave}
          // onClick={this.scrollToElement}
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
