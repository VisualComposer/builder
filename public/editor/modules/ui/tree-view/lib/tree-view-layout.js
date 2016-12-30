import vcCake from 'vc-cake'
import React from 'react'
import TreeViewElement from './element.js'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'

import '../css/tree/init.less'
import '../css/tree-view/init.less'

export default class TreeViewLayout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMousePos = this.handleMousePos.bind(this)
    this.handleScrollToElement = this.handleScrollToElement.bind(this)
    this.interactWithContent = this.interactWithContent.bind(this)
    this.handleAddElement = this.handleAddElement.bind(this)
    this.handleAddTemplate = this.handleAddTemplate.bind(this)
    this.state = {
      data: [],
      selectedItem: null
    }
  }
  componentDidMount () {
    this.props.api.reply('data:changed', (data) => {
      this.setState({ data: data })
    })
    this.setState({
      header: document.querySelector('.vcv-layout-bar-header').getBoundingClientRect()
    })
    this.props.api.reply('bar-content-start:show', this.handleScrollToElement)
    this.props.api.reply('editorContent:control:mouseEnter', this.interactWithContent)
    this.props.api.reply('editorContent:control:mouseLeave', this.interactWithContent)
  }

  componentWillUnmount () {
    this.props.api.forget('bar-content-start:show', this.handleScrollToElement)
    this.props.api.forget('editorContent:control:mouseEnter', this.interactWithContent)
    this.props.api.forget('editorContent:control:mouseLeave', this.interactWithContent)
  }

  interactWithContent (data = null) {
    let outlineElementId = null
    if (data && data.vcElementId) {
      if (data.type === 'mouseEnter') {
        outlineElementId = data.vcElementId
      }
      if (data.type === 'mouseLeave') {
        outlineElementId = null
      }
    }
    if (vcCake.getData('vcv:treeLayout:outlineElementId') !== outlineElementId) {
      vcCake.setData('vcv:treeLayout:outlineElementId', outlineElementId)
    }
  }

  handleMousePos (e) {
    if (e.target.closest('.vcv-ui-outline-control-more') !== null) {
      if (document.querySelector('.vcv-layout-bar-content').classList.contains('vcv-ui-state--visible')) {
        let layoutBar = document.querySelector('.vcv-layout-bar-header').getBoundingClientRect()
        let treeView = document.querySelector('.vcv-ui-tree-layout-container').getBoundingClientRect()
        let leftX = layoutBar.left
        let rightX = leftX + treeView.width
        let topY = layoutBar.bottom
        let bottomY = topY + treeView.height
        if (e.clientX > leftX && e.clientX < rightX && e.clientY > topY && e.clientY < bottomY) {
          this.state.selectedItem.classList.remove('vcv-ui-state--active')
          this.setState({
            selectedItem: null
          })
        }
      }
    }
  }

  handleMouseOver () {
    this.interactWithContent()
    this.handleSelectedItem()
  }

  handleSelectedItem (selectedItem = null) {
    if (this.state.selectedItem) {
      this.state.selectedItem.classList.remove('vcv-ui-state--active')
    }
    if (this.state.selectedItem !== selectedItem) {
      this.setState({
        selectedItem: selectedItem
      })
    }
    if (selectedItem) {
      selectedItem.classList.add('vcv-ui-state--active')
    }
  }

  expandTree (element) {
    if (!element.classList.contains('vcv-ui-tree-layout')) {
      if (element.classList.contains('vcv-ui-tree-layout-node-child') && !element.classList.contains('vcv-ui-tree-layout-node-expand')) {
        element.querySelector('.vcv-ui-tree-layout-node-expand-trigger').click()
      }
      this.expandTree(element.parentElement)
    }
  }

  handleScrollToElement (scrollToElement) {
    if (scrollToElement) {
      this.refs.scrollbars.scrollTop(0)
      let target = document.querySelector('[data-vcv-element="' + scrollToElement + '"]')
      this.expandTree(target)
      let offset = target.getBoundingClientRect().top
      this.handleSelectedItem(target.firstChild)
      this.refs.scrollbars.scrollTop(offset - this.state.header.height - this.state.header.bottom)
    }
  }

  getElements () {
    let elementsList = []
    const DocumentData = vcCake.getService('document')
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        let data = DocumentData.children(element.id)
        return <TreeViewElement
          element={element}
          data={data}
          key={element.id}
          level={1}
          api={this.props.api}
        />
      }, this)
    }
    return elementsList
  }

  handleAddElement (e) {
    e && e.preventDefault()
    this.props.api.request('app:add', null)
  }

  handleAddTemplate (e) {
    e && e.preventDefault()
    this.props.api.request('app:templates', true)
  }

  getElementsOutput () {
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
          There are no elements on your canvas - start by adding element or template
        </p>
      </div>
    )
  }

  render () {
    return (
      <div className='vcv-ui-tree-layout-container' onMouseOver={this.handleMouseOver}>
        <Scrollbar ref='scrollbars'>
          {this.getElementsOutput()}
          <div className='vcv-ui-tree-layout-actions'>
            <a
              className='vcv-ui-tree-layout-action'
              href='#'
              title='Add Element'
              onClick={this.handleAddElement}
            >
              <span className='vcv-ui-tree-layout-action-content'>
                <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-add' />
                <span>Add element</span>
              </span>
            </a>
            <a
              className='vcv-ui-tree-layout-action'
              href='#'
              title='Template'
              onClick={this.handleAddTemplate}
            >
              <span className='vcv-ui-tree-layout-action-content'>
                <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-template' />
                <span>Template</span>
              </span>
            </a>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
