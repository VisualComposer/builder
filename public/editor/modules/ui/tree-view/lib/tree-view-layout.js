import vcCake from 'vc-cake'
import React from 'react'
import TreeViewElement from './element.js'

import '../css/tree/init.less'
import '../css/tree-view/init.less'

class TreeViewLayout extends React.Component {
  constructor (props) {
    super(props)
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
    let elementsList
    const document = vcCake.getService('document')
    if (this.state.data) {
      elementsList = this.state.data.map((element) => {
        let data = document.children(element.id)
        return <TreeViewElement element={element} data={data} key={element.id} level={1} api={this.props.api} />
      }, this)
    }
    return elementsList
  }

  handleAddElement () {
    this.props.api.request('app:add', null)
  }

  getElementsOutput () {
    if (this.getElements().length) {
      return (
        <ul ref='scrollable' className='vcv-ui-tree-layout'>
          {this.getElements()}
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
        <div className='vcv-ui-scroll-container'>
          <div className='vcv-ui-scroll'>
            <div className='vcv-ui-scroll-content'>
              {this.getElementsOutput()}
              <div className='vcv-ui-tree-layout-actions'>
                <a className='vcv-ui-tree-layout-action' href='#' title='Add Element'
                  onClick={this.handleAddElement.bind(this)}>
                  <span
                    className='vcv-ui-tree-layout-action-content'>
                    <i
                      className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-add'></i>
                    <span>Add element</span>
                  </span>
                </a>
                <a className='vcv-ui-tree-layout-action' href='#' disabled title='Template'><span
                  className='vcv-ui-tree-layout-action-content'>
                  <i
                    className='vcv-ui-tree-layout-action-icon vcv-ui-icon vcv-ui-icon-template'></i><span>Template</span></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
TreeViewLayout.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = TreeViewLayout
