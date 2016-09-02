import React from 'react'
import classNames from 'classnames'
import FormTab from './tab'

export default class TabDependencyManager extends React.Component {
  static propTypes = {
    element: React.PropTypes.shape({
      get: React.PropTypes.func.isRequired
    }).isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    setFieldMount: React.PropTypes.func.isRequired,
    setFieldUnmount: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      ref: this.refs[ 'tab' ]
    }, true)
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey, true)
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    })

    return (
      <div ref='tab' className={classes}>
        <FormTab
          {...this.props}
          key={`form-tab-${this.props.element.get('id')}:${this.props.fieldKey}`}
        />
      </div>
    )
  }
}
