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
    this.props.api.reply('bar-content-start:show', (scrollToElement) => {
      this.handleScrollToElement(scrollToElement)
    })
    this.state = {
      data: [],
      selectedItem: null
    }
  }
  componentDidMount () {
    this.props.api.reply('data:add', () => {
      this.props.api.request('bar-content-start:hide')
    })

    this.props.api.reply('data:changed', (data) => {
      this.setState({ data: data })
    })
    this.setState({
      headerHeight: document.querySelector('#vcv-layout-header').getBoundingClientRect().height
    })
  }

  handleMouseOver () {
    this.handleSelectedItem()
  }

  handleSelectedItem (selectedItem) {
    let container = document.querySelector('.vcv-ui-tree-layout-container')
    if (this.state.selectedItem) {
      this.state.selectedItem.classList.remove('vcv-ui-state--active')
    }
    if (arguments.length) {
      this.setState({
        selectedItem: selectedItem
      })
      selectedItem.classList.add('vcv-ui-state--active')
    } else {
      this.setState({
        selectedItem: null
      })
    }
    if (window.event.pageX < container.offsetWidth && window.event.pageY < container.offsetHeight + 60) {
      this.state.selectedItem.classList.remove('vcv-ui-state--active')
      this.setState({
        selectedItem: null
      })
    }
  }

  expandTree (element) {
    if (!element.classList.contains('vcv-ui-tree-layout')) {
      if (element.classList.contains('vcv-ui-tree-layout-node-child')) {
        if (!element.classList.contains('vcv-ui-tree-layout-node-expand')) {
          element.querySelector('.vcv-ui-tree-layout-node-expand-trigger').click()
        }
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
      this.refs.scrollbars.scrollTop(offset - this.state.headerHeight)
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
          selected={this.state.selectedItem}
        />
      }, this)
    }
    return elementsList
  }

  handleAddElement = () => {
    this.props.api.request('app:add', null)
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
            <a className='vcv-ui-tree-layout-action' href='#' title='Add Element'
              onClick={this.handleAddElement}>
              <span className='vcv-ui-tree-layout-action-content'>
                <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-add' />
                <span>Add element</span>
              </span>
            </a>
            <a className='vcv-ui-tree-layout-action' href='#' disabled='disabled' title='Template'><span
              className='vcv-ui-tree-layout-action-content'>
              <i className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-template' /><span>Template</span></span>
            </a>
          </div>
        </Scrollbar>
      </div>
    )
  }
}
