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
    onUnmountCallback: React.PropTypes.func,
    scrollValue: React.PropTypes.any
  }

  static defaultProps = {
    iframe: document.getElementById('vcv-editor-iframe').contentWindow.document
  }

  adminBar = document.getElementById('wpadminbar')
  layoutBar = document.querySelector('.vcv-layout-bar')

  constructor (props) {
    super(props)

    this.state = {
      childExpand: true,
      isActive: false,
      hasChild: false,
      showOutline: false,
      element: props.element,
      content: props.element.customHeaderTitle || props.element.name,
      editable: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleOutline = this.handleOutline.bind(this)
    this.checkActive = this.checkActive.bind(this)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.enableEditable = this.enableEditable.bind(this)
    this.validateContent = this.validateContent.bind(this)
    this.preventNewLine = this.preventNewLine.bind(this)
  }

  dataUpdate (data) {
    this.setState({ element: data || this.props.element })
    if (data && data.hasOwnProperty('customHeaderTitle')) {
      let content = data.customHeaderTitle || data.name
      if (this.state.content !== content) {
        this.setState({
          content
        }, () => {
          this.span.innerText = content
        })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const newShowOutline = nextProps.showOutlineCallback(nextProps.element.id)
    newShowOutline !== this.state.showOutline && this.setState({ showOutline: newShowOutline })
    this.dataUpdate(nextProps.element)
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
    const { showOutlineCallback, onMountCallback, onUnmountCallback } = this.props
    const level = this.props.level + 1
    let elementsList = documentManger.children(this.state.element.id).map((element) => {
      return <TreeViewElement
        showOutlineCallback={showOutlineCallback}
        onMountCallback={onMountCallback}
        onUnmountCallback={onUnmountCallback}
        element={element}
        key={element.id}
        level={level}
        scrollValue={this.props.scrollValue} />
    }, this)
    return elementsList.length ? <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul> : ''
  }

  /**
   * Perform scroll to element inside iframe
   * @param e
   */
  scrollToElementInsideFrame (e) {
    const elId = e.currentTarget.parentNode.dataset.vcvElement
    const editorEl = this.props.iframe.querySelector(`#el-${elId}`)
    if (!editorEl) {
      return
    }
    const elRect = editorEl.getBoundingClientRect()
    const wh = document.getElementById('vcv-editor-iframe').contentWindow.innerHeight
    const below = elRect.bottom > wh && elRect.top > wh
    const above = elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      editorEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  /**
   * Perform scroll to element inside current document
   * @param e
   */
  scrollToElementInsideCurrentDocument (e) {
    const { scrollValue } = this.props
    const elId = e.currentTarget.parentNode.dataset.vcvElement
    const editorEl = document.getElementById(`el-${elId}-temp`)
    if (!editorEl) {
      return
    }
    const elRect = editorEl.getBoundingClientRect()
    const isFixed = window.getComputedStyle(this.layoutBar).position === 'fixed'
    const wh = window.innerHeight
    const below = elRect.bottom > wh && elRect.top > wh
    const above = isFixed ? elRect.bottom < this.layoutBar.getBoundingClientRect().bottom : elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      const barHeight = typeof scrollValue === 'function' ? scrollValue(this.layoutBar, this.adminBar) : scrollValue
      const curPos = window.pageYOffset
      const yPos = curPos + elRect.top - barHeight
      window.scrollTo(0, yPos)
    }
  }

  /**
   * Execute click handle on treeView element based on scrollValue prop
   * @param e
   */
  handleClick (e) {
    if (!this.props.scrollValue) {
      this.scrollToElementInsideFrame(e)
    } else {
      this.scrollToElementInsideCurrentDocument(e)
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

  enableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span.focus()
    })
  }

  updateContent (value) {
    const { element } = this.props
    element.customHeaderTitle = value
    elementsStorage.trigger('update', element.id, element, 'editFormTitle')
    this.setState({
      content: value || this.props.element.name,
      editable: false
    }, () => {
      if (!value) {
        this.span.innerText = this.props.element.name
      }
    })
  }

  validateContent () {
    let value = this.span.innerText.trim()
    this.updateContent(value)
  }

  preventNewLine = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span.blur()
      this.validateContent()
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addText = localizations ? localizations.add : 'Add'
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const cloneText = localizations ? localizations.clone : 'Clone'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    const rowLayoutText = localizations ? localizations.rowLayout : 'Row Layout'

    let element = cook.get(this.props.element)
    if (!element) {
      return null
    }
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
      let title = addElementText
      let addElementTag = ''
      let children = cook.getChildren(this.props.element.tag)
      if (children.length === 1) {
        title = `${addText} ${children[ 0 ].name}`
        addElementTag = children[ 0 ].tag
      }
      addChildControl = (
        <span
          className='vcv-ui-tree-layout-control-action'
          title={title}
          onClick={this.clickAddChild.bind(this, addElementTag)}
        >
          <i className='vcv-ui-icon vcv-ui-icon-add-thin' />
        </span>
      )
      if (this.props.element.tag === 'row') {
        editRowLayoutControl = (
          <span
            className='vcv-ui-tree-layout-control-action'
            title={rowLayoutText}
            onClick={this.clickEdit.bind(this, 'layout')}
          >
            <i className='vcv-ui-icon vcv-ui-icon-row-layout' />
          </span>
        )
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
      <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={this.clickEdit.bind(this, '')}>
        <i className='vcv-ui-icon vcv-ui-icon-edit' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={this.clickClone}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={this.clickDelete}>
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
      </span>
    </span>

    let controlClasses = classNames({
      'vcv-ui-tree-layout-control': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-state--outline': this.state.showOutline
    })

    let publicPath = hubCategoriesService.getElementIcon(element.get('tag'))
    let space = 0.8

    let { editable, content } = this.state

    let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
    if (editable) {
      controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
    }

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
          onClick={this.handleClick}
        >
          <div className='vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'>
            <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
          </div>
          <div className='vcv-ui-tree-layout-control-content'>
            {expandTrigger}
            <i className='vcv-ui-tree-layout-control-icon'><img src={publicPath} className='vcv-ui-icon' alt='' /></i>
            <span className={controlLabelClasses}>
              <span ref={span => { this.span = span }}
                contentEditable={editable}
                suppressContentEditableWarning
                onClick={this.enableEditable}
                onKeyDown={this.preventNewLine}
                onBlur={this.validateContent}>
                {content}
              </span>
            </span>
            {childControls}
          </div>
        </div>
        {child}
      </li>
    )
  }
}
