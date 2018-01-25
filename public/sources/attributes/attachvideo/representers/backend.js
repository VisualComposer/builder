import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import {getService} from 'vc-cake'

const cook = getService('cook')

export default class Backend extends Representer {
  getName (value) {
    if (value && value.urls && value.urls[ 0 ] && value.urls[ 0 ].title) {
      return value.urls[ 0 ].title
    } else {
      return ''
    }
  }

  render () {
    let { value } = this.state
    let options = cook.get({ tag: this.props.element.tag }).settings(this.props.fieldKey).settings.options
    let label = options.label
    let name = this.getName(value)

    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-attach-image': true
    })

    return (
      <div className={classes}>
        <div className='vcv-wpbackend-attr-representer-attach-image--wrapper'>
          {label}: {name}
        </div>
      </div>
    )
  }
}
