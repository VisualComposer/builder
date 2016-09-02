import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'

const cook = vcCake.getService('cook')
const AssetsManager = vcCake.getService('assets-manager')

class TreeViewElement extends React.Component {

  state = {
    childExpand: true,
    activeEditElementId: null,
    hasChild: false
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
    this.props.api
      .reply('app:edit', this.setElementId)
      .reply('app:add', this.setElementId)
      .reply('bar-content-end:hide', this.unsetElementId)
      .on('hide', this.unsetElementId)
      .on('form:hide', this.unsetElementId)
  }

  setElementId = (id) => {
    this.setState({ activeEditElementId: id })
  }

  unsetElementId = () => {
    this.setState({ activeEditElementId: null })
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
    this.props.api
      .forget('app:edit', this.setElementId)
      .forget('app:add', this.setElementId)
      .forget('bar-content-end:hide', this.unsetElementId)
      .off('hide', this.unsetElementId)
      .off('form:hide', this.unsetElementId)
  }

  clickChildExpand = () => {
    this.setState({ childExpand: !this.state.childExpand })
  }

  clickAddChild = (e) => {
    e && e.preventDefault()
    this.props.api.request('app:add', this.props.element.id)
  }

  clickClone = (e) => {
    e && e.preventDefault()
    this.props.api.request('data:clone', this.props.element.id)
  }

  clickEdit = (e) => {
    e && e.preventDefault()
    this.props.api.request('app:edit', this.props.element.id)
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
        return <TreeViewElement element={element} data={data} key={element.id} level={level} api={this.props.api} />
      }, this)
      return <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul>
    }
    return ''
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
    if (element.containerFor().length) {
      addChildControl = (
        <a className='vcv-ui-tree-layout-control-action' title='Add' onClick={this.clickAddChild}>
          <i className='vcv-ui-icon vcv-ui-icon-add-thin' />
        </a>
      )
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
      <a className='vcv-ui-tree-layout-control-action' title='Edit' onClick={this.clickEdit}>
        <i className='vcv-ui-icon vcv-ui-icon-edit' />
      </a>
      <a className='vcv-ui-tree-layout-control-action' title='Clone' onClick={this.clickClone}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </a>
      <a className='vcv-ui-tree-layout-control-action' title='Delete' onClick={this.clickDelete}>
        <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
      </a>
    </span>

    let controlClasses = classNames({
      'vcv-ui-tree-layout-control': true,
      'vcv-ui-state--active': this.props.element.id === this.state.activeEditElementId
    })

    let publicPath = AssetsManager.getPublicPath(element.get('tag'), element.get('metaIcon'))
    let space = 0.8

    return (
      <li className={treeChildClasses} data-vc-element={this.props.element.id} type={element.get('type')}
        name={element.get('name')}>
        <div className={controlClasses} style={{ paddingLeft: (space * this.props.level + 1) + 'rem' }}>
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
TreeViewElement.propTypes = {
  element: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.bool ]),
  data: React.PropTypes.oneOfType([ React.PropTypes.object, React.PropTypes.array ]),
  api: React.PropTypes.object.isRequired,
  level: React.PropTypes.number
}

export default TreeViewElement
