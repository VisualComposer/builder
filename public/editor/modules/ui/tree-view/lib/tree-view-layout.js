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
    this.props.api.reply('bar-content-start:show', (scrollToElement) => {
      vcCake.setData('vcvTreeView:scrollTo', scrollToElement)
    })
    this.state = {
      data: []
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

  getElements () {
    let elementsList = []
    const DocumentData = vcCake.getService('document')
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        let data = DocumentData.children(element.id)
        return <TreeViewElement element={element} data={data} key={element.id} level={1} api={this.props.api} />
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
      <div className='vcv-ui-tree-layout-container'>
        <Scrollbar>
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
