import React from 'react'
import RowControl from './lib/rowControl'

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  render () {
    return <div className='vcv-row-control-container vcv-row-control-container-hide-labels'>
      <RowControl
        api={this.props.api}
        id={this.props.id}
        title='Add Element'
        text='Add Element'
        disabled={false}
        icon='add'
        action='app:add'
      />
      <RowControl
        api={this.props.api}
        id={this.props.id}
        title='Template'
        text='Template'
        disabled
        icon='template'
        action='app:template'
      />
    </div>
  }
}
