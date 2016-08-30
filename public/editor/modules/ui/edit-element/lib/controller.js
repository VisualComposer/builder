import React from 'react'
import EditForm from './form'

export default class EditElementController extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired
  }

  render () {
    return (
      <EditForm api={this.props.api} element={this.props.element} />
    )
  }
}
