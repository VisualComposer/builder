import React from 'react'
import Attribute from '../attribute'
import vcCake from 'vc-cake'
import serialize from 'form-serialize'

export default class AjaxForm extends Attribute {
  fieldContainer = null
  fields = null
  pseudoForm = document.createElement('form')

  updateState (props) {
    return {
      value: props.value,
      formContent: '<span class="vcv-ui-icon vcv-ui-wp-spinner"></span>',
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
    if (this.state.formStatus && this.fieldContainer && !this.state.formBound) {
      this.fields = Array.from(this.fieldContainer.querySelectorAll('input, select, textarea, datalist'))
      this.bindFormChangeEvents()
    }
  }

  componentWillUnmount () {
    this.serverRequest.abort()
    if (this.fieldContainer && this.fields) {
      this.fields.forEach((field) => {
        field.removeEventListener('change', this.handleFormChange.bind(this))
      })
    }
  }

  bindFormChangeEvents () {
    if (this.fieldContainer && this.fields) {
      this.fields.forEach((field) => {
        field.addEventListener('change', this.handleFormChange.bind(this))
      })
      let aTagElements = this.fieldContainer.querySelectorAll('a')
      aTagElements = Array.from(aTagElements)
      aTagElements.forEach((node) => {
        node.setAttribute('target', '_blank')
      })
    }
    this.setState({
      formBound: true
    })
  }

  handleFormChange () {
    this.fields.forEach((field) => {
      this.pseudoForm.appendChild(field.cloneNode(true))
    })
    let value = serialize(this.pseudoForm, { hash: true })
    this.setFieldValue(value)
  }

  requestToServer () {
    let ajax = vcCake.getService('utils').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    let action = this.props.options.action
    let value = this.state.value

    this.setState({
      formContent: '<span class="vcv-ui-icon vcv-ui-wp-spinner"></span>',
      formStatus: false,
      formBound: false
    })

    this.serverRequest = ajax({
      'vcv-action': `attribute:ajaxForm:render:adminNonce`,
      'vcv-form-action': action,
      'vcv-form-element': this.props.element.toJS(),
      'vcv-form-value': value,
      'vcv-nonce': window.vcvNonce,
      'vcv-source-id': window.vcvSourceID
    }, (result) => {
      let response = JSON.parse(result.response)
      if (response && response.status) {
        this.setState({
          formContent: response.html || 'There are no options for this widget.',
          formStatus: true,
          formBound: false
        })
      } else {
        this.setState({
          formContent: 'There are no options for this widget.',
          formStatus: false,
          formBound: false
        })
      }
    })
  }

  render () {
    return (
      <div className='vcv-ui-ajax-form-container'>
        <div ref={ref => { this.fieldContainer = ref }}>
          <div dangerouslySetInnerHTML={{ __html: this.state.formContent || '' }} />
        </div>
      </div>
    )
  }
}
