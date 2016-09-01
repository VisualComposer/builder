import React from 'react'
import classNames from 'classnames'
import FormTab from './tab'

export default class TabDependencyManager extends React.Component {
  static propTypes = {
    element: React.PropTypes.shape({
      data: React.PropTypes.object.isRequired
    }).isRequired,
    fieldKey: React.PropTypes.string.isRequired
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-tab-dependency': true
    })

    return (
      <div className={classes}>
        <FormTab
          {...this.props}
          key={`form-tab-${this.props.element.data.id}:${this.props.fieldKey}`}
        />
      </div>
    )
  }
}
