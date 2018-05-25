import { getStorage, getService, env } from 'vc-cake'
import React from 'react'
import TreeViewElement from './lib/treeViewElement'
import TreeViewDndManager from './lib/treeViewDndManager'
import Scrollbar from '../../scrollbar/scrollbar.js'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const layoutStorage = getStorage('layout')
const workspaceSettings = getStorage('workspace').state('settings')

const documentManager = getService('document')

export default class TreeViewLayout extends React.Component {
  static propTypes = {
    scrollValue: PropTypes.any,
    contentStartId: PropTypes.string,
    contentId: PropTypes.string,
    visible: PropTypes.bool,
    isAttribute: PropTypes.bool,
    element: PropTypes.object
  }

  layoutContainer = null
  scrollbar = null
  scrollTimeout = 0

  constructor (props) {
    super(props)
    this.updateElementsData = lodash.debounce(this.updateElementsData.bind(this), 250)
    this.handleScrollToElement = this.handleScrollToElement.bind(this)
    this.interactWithContent = this.interactWithContent.bind(this)
    this.handleAddElement = this.handleAddElement.bind(this)
    this.handleAddTemplate = this.handleAddTemplate.bind(this)
    this.checkShowOutlineCallback = this.checkShowOutlineCallback.bind(this)
    this.onElementMount = this.onElementMount.bind(this)
    this.onElementUnmount = this.onElementUnmount.bind(this)
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.dnd = new TreeViewDndManager()
    this.state = {
      data: [],
      selectedItem: null,
      outlineElementId: false
    }
  }

  updateElementsData (data) {
    let newData = data
    if (env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute) {
      newData = documentManager.children(this.props.element.get('id'))
      this.setTreeViewHeight(newData)
    }
    this.setState({ data: newData })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').onChange(this.interactWithContent)
    let data = env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute ? documentManager.children(this.props.element.get('id')) : documentManager.children(false)
    if (env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute) {
      this.setTreeViewHeight(data)
      elementsStorage.on(`element:${this.props.element.get('id')}`, this.updateElementsData)
    }
    this.setState({
      header: document.querySelector('.vcv-ui-navbar-container'),
      data: data
    })
    this.scrollTimeout = setTimeout(() => {
      this.handleScrollToElement(this.props.contentStartId || this.props.contentId)
    }, 1)
    workspaceStorage.state('content').onChange((value, id) => {
      this.handleScrollToElement(id)
    })
    workspaceStorage.state('contentStart').onChange((value, id) => {
      this.handleScrollToElement(id)
    })
  }

  componentWillUnmount () {
    this.updateElementsData.cancel()
    elementsStorage.state('document').ignoreChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').ignoreChange(this.interactWithContent)
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout)
      this.scrollTimeout = 0
    }
    if (env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute) {
      elementsStorage.off(`element:${this.props.element.get('id')}`, this.updateElementsData)
    }
    /*
     this.props.api.forget('bar-content-start:show', this.handleScrollToElement)
     this.props.api.forget('editorContent:control:mouseEnter', this.interactWithContent)
     this.props.api.forget('editorContent:control:mouseLeave', this.interactWithContent)
     */
  }

  interactWithContent (id = false) {
    this.setState({ outlineElementId: id })
  }

  expandTree (element) {
    if (!element.classList.contains('vcv-ui-tree-layout')) {
      if (element.classList.contains('vcv-ui-tree-layout-node-child') && !element.classList.contains('vcv-ui-tree-layout-node-expand')) {
        element.querySelector('.vcv-ui-tree-layout-node-expand-trigger').click()
      }
      this.expandTree(element.parentElement)
    }
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
    this.handleScrollToElement(this.props.contentStartId || this.props.contentId)
  }

  handleScrollToElement (scrollToElement) {
    if (scrollToElement && this.scrollbar && this.layoutContainer) {
      const container = this.layoutContainer.querySelector('.vcv-ui-tree-layout').getBoundingClientRect()
      const target = this.layoutContainer.querySelector(`[data-vcv-element="${scrollToElement}"]`)
      this.expandTree(target)
      const targetTop = target.getBoundingClientRect().top
      const offset = targetTop - container.top
      this.interactWithContent(scrollToElement)
      this.scrollbar.scrollTop(offset)
    }
  }

  checkShowOutlineCallback (id) {
    return this.state.outlineElementId === id
  }

  getElements () {
    let elementsList = []
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        return <TreeViewElement
          element={element}
          key={element.id}
          level={1}
          showOutlineCallback={this.checkShowOutlineCallback}
          onMountCallback={this.onElementMount}
          onUnmountCallback={this.onElementUnmount}
          scrollValue={this.props.scrollValue}
        />
      }, this)
    }
    return elementsList
  }

  onElementMount (id) {
    this.dnd.add(id, this.props.isAttribute)
  }

  onElementUnmount (id) {
    this.dnd.remove(id, this.props.isAttribute)
  }

  handleAddElement (e) {
    e && e.preventDefault()
    if (env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute) {
      workspaceStorage.trigger('add', this.props.element.get('id'), this.props.element.get('tag'), {})
    } else {
      workspaceStorage.trigger('add', null)
    }
    // this.props.api.request('app:add', null)
  }

  handleAddTemplate (e) {
    e && e.preventDefault()
    workspaceSettings.set({
      action: 'addTemplate',
      element: {},
      tag: '',
      options: {}
    })
  }

  getElementsOutput () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const text = localizations ? localizations.emptyTreeView : 'There is no content on your page - start by adding element or template.'

    let elements = this.getElements()
    if (elements.length) {
      return (
        <ul className='vcv-ui-tree-layout'>
          {elements}
        </ul>
      )
    }
    return (
      <div className='vcv-ui-tree-layout-messages'>
        <p className='vcv-ui-tree-layout-message'>
          {text}
        </p>
      </div>
    )
  }

  setTreeViewHeight (data) {
    const treeLayoutChild = this.layoutContainer.querySelector('.vcv-ui-tree-layout-node-child')
    const treeLayoutActions = this.layoutContainer.querySelector('.vcv-ui-tree-layout-actions')
    let treeLayoutChildRect = treeLayoutChild ? treeLayoutChild.getBoundingClientRect() : null
    let treeLayoutActionsRect = treeLayoutActions ? treeLayoutActions.getBoundingClientRect() : null
    const minHeight = 161
    let treeViewHeight = treeLayoutChildRect && treeLayoutActionsRect ? treeLayoutChildRect.height * data.length + treeLayoutActionsRect.height : minHeight
    this.setState({ height: treeViewHeight })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const addTemplateText = localizations ? localizations.addTemplate : 'Add Template'
    const { height } = this.state

    let treeLayoutClasses = classNames({
      'vcv-ui-tree-layout-container': true,
      'vcv-ui-state--hidden': !this.props.visible
    })

    let treeLayoutStyles = env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute ? {
      height: height ? `${height}px` : 0
    } : {}

    let addTemplate = env('FT_TREE_VIEW_ATTRIBUTE') && this.props.isAttribute ? null
      : <span
        className='vcv-ui-tree-layout-action'
        title={addTemplateText}
        onClick={this.handleAddTemplate}
      >
        <span className='vcv-ui-tree-layout-action-content'>
          <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>{addTemplateText}</span>
        </span>
      </span>

    return (
      <div
        className={treeLayoutClasses}
        ref={(layoutContainer) => { this.layoutContainer = layoutContainer }}
        style={treeLayoutStyles}
      >
        <Scrollbar ref={this.scrollBarMounted}>
          {this.getElementsOutput()}
          <div className='vcv-ui-tree-layout-actions'>
            <span
              className='vcv-ui-tree-layout-action'
              title={addElementText}
              onClick={this.handleAddElement}
            >
              <span className='vcv-ui-tree-layout-action-content'>
                <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-add' />
                <span>{addElementText}</span>
              </span>
            </span>
            {addTemplate}
          </div>
        </Scrollbar>
      </div>
    )
  }
}
