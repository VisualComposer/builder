import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class FormDropdownOption extends React.Component {
  static propTypes = {
    tab: PropTypes.object.isRequired,
    setFieldMount: PropTypes.func.isRequired,
    setFieldUnmount: PropTypes.func.isRequired
  }
  state = {
    dependenciesClasses: []
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.tab.fieldKey, {
      ref: this.refs[ 'domComponent' ],
      refComponent: this,
      refDomComponent: this.refs[ 'domComponent' ]
    }, 'dropdown')
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.tab.fieldKey, 'dropdown')
  }

  render () {
    let { tab } = this.props
    let title = tab.data.settings.options.tabLabel || tab.data.settings.options.label
    let classes = classNames({
      'vcv-ui-form-dropdown-option': true
    }, this.state.dependenciesClasses)

    return (
      <option
        ref='domComponent'
        className={classes}
        value={tab.index}
      >{title}</option>
    )
  }
}
