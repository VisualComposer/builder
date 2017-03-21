import React from 'react'
import RowControl from './lib/rowControl'
import vcCake from 'vc-cake'

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  render () {
    let element = vcCake.getService('document').get(this.props.id)
    let addTitle = 'Add Element'
    let addElementTag = ''
    let children = vcCake.getService('cook').getChildren(element.tag)
    if (children.length === 1) {
      addTitle = `Add ${children[0].name}`
      addElementTag = children[0].tag
    }
    return <vcvhelper className='vcv-row-control-container vcv-row-control-container-hide-labels'>
      <RowControl
        api={this.props.api}
        id={this.props.id}
        title={addTitle}
        text={addTitle}
        icon='add'
        action='app:add'
        options={addElementTag}
      />
    </vcvhelper>
  }
}
