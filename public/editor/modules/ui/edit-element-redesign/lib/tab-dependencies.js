import React from 'react'
import classNames from 'classnames'
import FormTab from './tab'

export default class TabDependencyManager extends React.Component {
  render () {
    let classes = classNames({
      'vcv-ui-form-tab-dependency': true
    })

    return (
      <div className={classes}>
        <FormTab
          {...this.props}
        />
      </div>
    )
  }
}
