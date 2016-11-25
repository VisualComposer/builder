import React from 'react'
import classNames from 'classnames'
import Field from './field'

export default class FieldDependencyManager extends React.Component {
  static propTypes = {
    fieldKey: React.PropTypes.string.isRequired,
    updater: React.PropTypes.func.isRequired,
    setFieldMount: React.PropTypes.func.isRequired,
    setFieldUnmount: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      ref: this.refs[ 'field' ],
      refComponent: this
    })
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey)
  }

  componentWillReceiveProps (nextProps) {
    this.props.setFieldMount(nextProps.fieldKey, {
      ref: this.refs[ 'field' ],
      refComponent: this
    })
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    })

    return (
      <div ref='field' className={classes}>
        <Field
          {...this.props}
        />
      </div>
    )
  }
}
