import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let iconClasses = this.state.value.icon
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-icon': true
    })
    return <div className={classes}>
      <span className='vcv-wpbackend-attr-representer-icon-label'>Icon: </span>
      <span className={iconClasses} />
    </div>
  }
}
