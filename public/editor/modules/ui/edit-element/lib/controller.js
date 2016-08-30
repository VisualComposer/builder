import React from 'react'
import FormWrapper from './form-wrapper-tabs'

export default class EditElementController extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    element: React.PropTypes.object.isRequired
  }

  render () {
    return (
      <FormWrapper {...this.props} />
    )
  }
}
