import { getStorage, getService } from 'vc-cake'
import React from 'react'
import TreeViewElementWrapper from './lib/treeViewElementWrapper'
import TreeViewDndManager from './lib/treeViewDndManager'
import Scrollbar from '../../scrollbar/scrollbar'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const layoutStorage = getStorage('layout')
const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentState = getStorage('workspace').state('content')
const workspaceTreeViewId = workspaceStorage.state('treeViewId')

const documentManager = getService('document')
const cook = getService('cook')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class TreeViewLayout extends React.Component {
  static propTypes = {
    scrollValue: PropTypes.any,
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
    this.handleElementMount = this.handleElementMount.bind(this)
    this.handleElementUnmount = this.handleElementUnmount.bind(this)
    this.scrollBarMounted = this.scrollBarMounted.bind(this)
    this.getScrollbarContent = this.getScrollbarContent.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
    this.dnd = new TreeViewDndManager()

    const data = props.isAttribute ? documentManager.children(props.element.get('id')) : documentManager.children(false)

    this.state = {
      data: data,
      selectedItem: null,
      outlineElementId: false,
      isVisible: props.isAttribute || workspaceContentState.get() === 'treeView'
    }
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').onChange(this.interactWithContent)

    if (this.props.isAttribute) {
      elementsStorage.on(`element:${this.props.element.get('id')}`, this.updateElementsData)
    } else {
      workspaceContentState.onChange(this.setVisibility)
    }

    this.scrollTimeout = setTimeout(() => {
      this.handleScrollToElement(workspaceTreeViewId.get())
    }, 1)
    workspaceTreeViewId.onChange(this.onContentChangeHandleScroll)
  }

  componentWillUnmount () {
    this.updateElementsData.cancel()
    elementsStorage.state('document').ignoreChange(this.updateElementsData)
    layoutStorage.state('userInteractWith').ignoreChange(this.interactWithContent)
    workspaceTreeViewId.ignoreChange(this.onContentChangeHandleScroll)
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout)
      this.scrollTimeout = 0
    }
    if (this.props.isAttribute) {
      elementsStorage.off(`element:${this.props.element.get('id')}`, this.updateElementsData)
    } else {
      workspaceContentState.ignoreChange(this.setVisibility)
    }
  }

  setVisibility (activePanel) {
    const data = this.props.isAttribute ? documentManager.children(this.props.element.get('id')) : documentManager.children(false)
    this.setState({
      isVisible: activePanel === 'treeView',
      data: data
    })
  }

  updateElementsData (data, singleElement = false) {
    let newData
    if (singleElement && singleElement === 'singleElement') {
      const currentData = this.state.data
      const newDataIndex = currentData.findIndex(element => element.id === data.id)
      currentData[newDataIndex] = data
      newData = currentData
    } else {
      newData = data
    }

    if (this.props.isAttribute) {
      newData = documentManager.children(this.props.element.get('id'))
    }
    this.setState({ data: newData })
  }

  onContentChangeHandleScroll = (treeViewId) => {
    const timeout = setTimeout(() => {
      treeViewId && this.handleScrollToElement(treeViewId)
      clearTimeout(timeout)
    }, 1)
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

  getExistingParent (id) {
    const parentId = documentManager.get(id).parent
    const parentElement = this.layoutContainer.querySelector(`[data-vcv-element="${parentId}"]`)

    if (parentElement) {
      return parentElement
    } else {
      return this.getExistingParent(parentId)
    }
  }

  scrollBarMounted (scrollbar) {
    this.scrollbar = scrollbar
    this.handleScrollToElement(workspaceTreeViewId.get())
  }

  handleScrollToElement (scrollToElement) {
    if (scrollToElement && this.scrollbar && this.layoutContainer) {
      const container = this.layoutContainer.querySelector('.vcv-ui-tree-layout').getBoundingClientRect()
      let target = this.layoutContainer.querySelector(`[data-vcv-element="${scrollToElement}"]`)
      if (!target) {
        this.expandTree(this.getExistingParent(scrollToElement))
        target = this.layoutContainer.querySelector(`[data-vcv-element="${scrollToElement}"]`)
      }
      this.expandTree(target)
      const targetTop = target.getBoundingClientRect().top
      const offset = targetTop - container.top
      this.interactWithContent(scrollToElement)
      this.scrollbar.scrollTop(offset)
      workspaceTreeViewId.set(null)
    }
  }

  getElements () {
    let elementsList = []
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        return (
          <TreeViewElementWrapper
            id={element.id}
            key={'tree-view-' + element.id}
            level={1}
            onMountCallback={this.handleElementMount}
            onUnmountCallback={this.handleElementUnmount}
            scrollValue={this.props.scrollValue}
            isAttribute={this.props.isAttribute}
            updateElementsData={this.updateElementsData}
          />
        )
      }, this)
    }
    return elementsList
  }

  handleElementMount (id) {
    const cookElement = cook.getById(id)
    const isDraggable = cookElement.get('metaIsDraggable')
    if (isDraggable === undefined || isDraggable) {
      let containerSelector = ''
      const topParentId = documentManager.getTopParent(id)
      const isParentDraggable = cook.getById(topParentId).get('metaIsDraggable')
      if (isParentDraggable !== undefined && !isParentDraggable && !this.props.isAttribute) {
        containerSelector = `[data-vcv-element="${topParentId}"]`
      }

      this.dnd.add(id, this.props.isAttribute, containerSelector)
    }
  }

  handleElementUnmount (id) {
    this.dnd.remove(id, this.props.isAttribute)
  }

  handleAddElement (e) {
    e && e.preventDefault()
    if (roleManager.can('editor_content_element_add', roleManager.defaultTrue())) {
      if (this.props.isAttribute) {
        workspaceStorage.trigger('add', this.props.element.get('id'), this.props.element.get('tag'))
      } else {
        workspaceStorage.trigger('add', null)
      }
    } else {
      workspaceStorage.trigger('addTemplate', null)
    }
  }

  handleRemoveAllElements (e) {
    e && e.preventDefault()
    const allElements = documentManager.children(false)
    allElements.forEach((row, index) => {
      const silent = allElements.length - 1 !== index
      elementsStorage.trigger('remove', row.id, { silent })
    })
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
    const localizations = dataManager.get('localizations')
    const text = localizations ? localizations.emptyTreeView : 'There is no content on the page - start by adding an element or template.'

    const elements = this.getElements()
    const classes = classNames({
      'vcv-ui-tree-layout': true,
      'vcv-ui-tree-layout-empty-content': !elements.length
    })

    return (
      <ul className={classes}>
        {elements?.length ? elements : <li className='vcv-ui-tree-layout-message'>{text}</li>}
      </ul>
    )
  }

  getScrollbarContent () {
    const localizations = dataManager.get('localizations')
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const removeAllText = localizations ? localizations.removeAll : 'Remove All'
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue()) || roleManager.can('editor_content_template_add', roleManager.defaultTrue())
    let addElementControl = null
    if (isAbleToAdd) {
      addElementControl = (
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
      )
    }

    return (
      <>
        {this.getElementsOutput()}
        <div className='vcv-ui-tree-layout-actions'>
          {addElementControl}
          {!this.props.isAttribute ? (
            <span
              className='vcv-ui-tree-layout-action'
              title={removeAllText}
              onClick={this.handleRemoveAllElements}
            >
              <span className='vcv-ui-tree-layout-action-content'>
                <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-trash' />
                <span>{removeAllText}</span>
              </span>
            </span>
          ) : null}
        </div>
      </>
    )
  }

  render () {
    const treeLayoutClasses = classNames({
      'vcv-ui-tree-layout-container': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    let treeViewContent = ''

    if (!this.props.isAttribute) {
      treeViewContent = (
        <Scrollbar ref={this.scrollBarMounted}>
          {this.getScrollbarContent()}
        </Scrollbar>
      )
    } else {
      treeViewContent = this.getScrollbarContent()
    }

    return (
      <div
        className={treeLayoutClasses}
        ref={(layoutContainer) => { this.layoutContainer = layoutContainer }}
      >
        {treeViewContent}
      </div>
    )
  }
}
