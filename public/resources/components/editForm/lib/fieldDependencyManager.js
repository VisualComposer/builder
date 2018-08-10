import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Field from './field'

export default class FieldDependencyManager extends React.Component {
  static propTypes = {
    fieldKey: PropTypes.string.isRequired,
    setFieldMount: PropTypes.func.isRequired,
    setFieldUnmount: PropTypes.func.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
    removeDependencies: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      dependenciesClasses: []
    }
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      ref: this.refs.field,
      refComponent: this,
      refDomComponent: this.refs.domComponent
    }, 'field')
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey, 'field')
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)

    return (
      <div ref='field' className={classes}>
        <Field ref='domComponent' {...this.props} />
      </div>
    )
  }
}
