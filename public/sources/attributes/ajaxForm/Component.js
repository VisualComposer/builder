import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import vcCake from 'vc-cake'

export default class AjaxForm extends Attribute {

  updateState (props) {
    return {
      value: props.value,
      formContent: ''
    }
  }

  componentDidUpdate (prevProps) {
    if (!lodash.isEqual(this.props.atts, prevProps.atts)) {
      this.requestToServer()
    }
  }

  componentDidMount () {
    this.requestToServer()
  }

  requestToServer () {
    let ajax = vcCake.getService('utils').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    let action = this.props.options.action
    let value = this.state.value
    let data = this.props.options.data

    this.serverRequest = ajax({
      'vcv-action': `attribute:ajaxForm:render:adminNonce`,
      'vcv-form-action': action,
      'vcv-form-data': data,
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
          formStatus: false
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
