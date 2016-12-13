import React from 'react'
import Attribute from '../attribute'
import vcCake from 'vc-cake'
import serialize from 'form-serialize'

export default class AjaxForm extends Attribute {

  updateState (props) {
    return {
      value: props.value,
      formContent: 'Loading...',
      formStatus: false,
      formBound: false
    }
  }

  componentDidMount () {
    this.requestToServer()
  }

  componentWillReceiveProps (nextProps) {
    // Intentionally left blank
    // TODO: Possibly remove this hook in Attributes.js
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.formStatus && this.refs.form && !this.state.formBound) {
      this.bindFormChangeEvents()
    }
  }

  bindFormChangeEvents () {
    let elements = Array.from(this.refs.form.elements)
    elements.forEach((node) => {
      node.addEventListener('change', this.handleFormChange.bind(this))
    })
    this.setState({
      formBound: true
    })
  }

  handleFormChange (e) {
    let value = serialize(this.refs.form, { hash: true })
    this.setFieldValue(value)
  }

  requestToServer () {
    let ajax = vcCake.getService('utils').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    let action = this.props.options.action
    let value = this.state.value

    this.serverRequest = ajax({
      'vcv-action': `attribute:ajaxForm:render:adminNonce`,
      'vcv-form-action': action,
      'vcv-form-element': this.props.element.toJS(),
      'vcv-form-value': value,
      'vcv-nonce': window.vcvNonce
    }, (result) => {
      let response = JSON.parse(result.response)
      if (response && response.status && response.html) {
        this.setState({
          formContent: response.html,
          formStatus: true
        })
      } else {
        this.setState({
          formContent: 'Failed to Load Form',
          formStatus: false,
          formBound: false
        })
      }
    })
  }

  render () {
    return (
      <div className='vcv-ui-ajax-form-container'>
        <form ref='form'>
          <div dangerouslySetInnerHTML={{ __html: this.state.formContent || '' }} />
        </form>
      </div>
    )
  }
}
