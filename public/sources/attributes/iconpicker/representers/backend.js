import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  render () {
    let iconClasses = classNames({
      'vcv-wpbackend-attr-representer-icon': true
    })
    iconClasses = `${iconClasses} ${this.state.value.icon}`
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attr-representer-icon-container': true
    })
    return <div className={classes}>
      <div className='vcv-wpbackend-attr-representer-icon-inner'>
        <span className='vcv-wpbackend-attr-representer-icon-label'>Icon: </span>
        <span className={iconClasses} />
      </div>
    </div>
  }
}
