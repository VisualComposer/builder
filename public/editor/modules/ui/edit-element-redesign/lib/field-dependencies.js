import React from 'react'
import classNames from 'classnames'
import Field from './field'

export default class FieldDependencyManager extends React.Component {

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    })

    return (
      <div className={classes}>
        <Field
          {...this.props}
        />
      </div>
    )
  }
}
