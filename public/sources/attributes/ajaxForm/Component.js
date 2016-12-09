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
    this.serverRequest = ajax({
      'vcv-action': `attribute:ajaxForm:render:adminNonce`,
      'vcv-form-action': '', // TODO: Get from settings.
      'vcv-form-data': this.state.value,
      'vcv-nonce': window.vcvNonce
    }, (result) => {
      let response = JSON.parse(result.response)
      if (response && response.status && response.html) {
        this.setState({
          formContent: response.html
        })
      } else {
        this.setState({
          formContent: 'Failed to Load Form'
        })
      }
    })
  }

  render () {
    return (
      <div className='vcv-ui-ajax-form-container'>
        <div dangerouslySetInnerHTML={{ __html: this.state.formContent || '' }} />
      </div>
    )
  }
}
