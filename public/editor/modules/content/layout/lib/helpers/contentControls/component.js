import React from 'react'
import RowControl from './lib/rowControl'
import {getService} from 'vc-cake'

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  render () {
    let element = getService('document').get(this.props.id)
    let addTitle = 'Add Element'
    let addElementTag = ''
    let children = getService('cook').getChildren(element.tag)
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
      <RowControl
        api={this.props.api}
        id={this.props.id}
        title='Add Template'
        text='Add Template'
        disabled
        icon='template'
        action='app:template'
      />
    </vcvhelper>
  }
}
