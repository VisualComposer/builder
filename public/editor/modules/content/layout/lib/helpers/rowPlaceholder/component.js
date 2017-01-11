import React from 'react'

export default class RowPlaceholder extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.handleAddElementClick = this.handleAddElementClick.bind(this)
    this.handleAddTemplateClick = this.handleAddTemplateClick.bind(this)
  }

  handleAddElementClick (e) {
    e && e.preventDefault()
    this.props.api.request('app:add')
  }

  handleAddTemplateClick (e) {
    e && e.preventDefault()
    this.props.api.request('app:templates', true)
  }

  render () {
    let addElementTitle = 'Add Element'
    let addTemplateTitle = 'Add Element'

    return <vcvhelper>
      <div className='vcv-row-placeholder vcv-row-control-container vcv-row-control-container-hide-labels'>
        <a
          className='vcv-row-control'
          href='#'
          title={addElementTitle}
          onClick={this.handleAddElementClick}
        >
          <span className='vcv-row-control-content'>
            <i className='vcv-row-control-icon vcv-ui-icon vcv-ui-icon-add' />
            <span>{addElementTitle}</span>
          </span>
        </a>
        <a
          className='vcv-row-control'
          href='#'
          title={addTemplateTitle}
          onClick={this.handleAddTemplateClick}
        >
          <span className='vcv-row-control-content'>
            <i className='vcv-row-control-icon vcv-ui-icon vcv-ui-icon-template' />
            <span>{addTemplateTitle}</span>
          </span>
        </a>
      </div>
    </vcvhelper>
  }
}
