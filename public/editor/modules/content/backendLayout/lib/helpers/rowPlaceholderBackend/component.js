import React from 'react'
import RowPlaceholderControl from './lib/rowPlaceholderControl'

export default class RowPlaceholderBackend extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  render () {
    let addElementTitle = 'Add Element'
    let addTemplateTitle = 'Add Template'

    return <vcvhelper>
      <div className='vcv-row-placeholder vcv-row-control-container vcv-row-control-container-hide-labels'>
        <RowPlaceholderControl
          api={this.props.api}
          title={addElementTitle}
          text={addElementTitle}
          icon='add'
          action='app:add'
        />
        <RowPlaceholderControl
          api={this.props.api}
          title={addTemplateTitle}
          text={addTemplateTitle}
          icon='template'
          action='app:templates'
          options='true'
        />
      </div>
    </vcvhelper>
  }
}
