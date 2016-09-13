import React from 'react'

export default class ContentControls extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    id: React.PropTypes.string.isRequired
  }

  handleClick (action, e) {
    e && e.preventDefault()
    this.props.api.request(action, this.props.id)
  }

  render () {
    return <div className='vcv-row-control-container vcv-row-control-container-hide-labels'>
      <a className='vcv-row-control' href='#' title='Add Element' onClick={this.handleClick.bind(this, 'app:add')}>
        <span className='vcv-row-control-content'>
          <i className='vcv-row-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>Add Element</span>
        </span>
      </a>
      <a className='vcv-row-control' href='#' title='Template' disabled>
        <span className='vcv-row-control-content'>
          <i className='vcv-row-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>Template</span>
        </span>
      </a>
    </div>
  }
}
