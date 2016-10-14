import vcCake from 'vc-cake'
import React from 'react'
import TreeViewElement from './element.js'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'

import '../css/tree/init.less'
import '../css/tree-view/init.less'

export default class TreeViewLayout extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    treeViewContainer: React.PropTypes.any
  }

  static defaultProps = {
    treeViewContainer: document.querySelector('.vcv-ui-tree-layout-container')
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
  }

  handleMouseOver () {
    this.handleSelectedItem()
  }

  handleSelectedItem (selectedItem) {
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
  }

  handleScrollToElement (scrollToElement) {
    if (scrollToElement) {
      const target = document.querySelector('[data-vcv-element="' + scrollToElement + '"]')
      let el = target
      let offset = 0

      if (el.parentElement.classList.contains('vcv-ui-tree-layout')) {
        offset += el.offsetTop
      } else {
        while (!el.parentElement.classList.contains('vcv-ui-tree-layout')) {
          el = el.parentElement
          offset += el.offsetTop
        }
      }
      this.handleSelectedItem(target.firstChild)
      this.refs.scrollbars.scrollTop(offset)
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
