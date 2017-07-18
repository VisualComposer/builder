import React from 'react'
import classNames from 'classnames'
import Field from './field'
import vcCake from 'vc-cake'

export default class FieldDependencyManager extends React.Component {
  static propTypes = {
    fieldKey: React.PropTypes.string.isRequired,
    updater: React.PropTypes.func.isRequired,
    setFieldMount: React.PropTypes.func.isRequired,
    setFieldUnmount: React.PropTypes.func.isRequired,
    updateDependencies: vcCake.env('EDIT_FORM_ACCORDION') ? React.PropTypes.func.isRequired : React.PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      dependenciesClasses: []
    }
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      ref: this.refs[ 'field' ],
      refComponent: this,
      refDomComponent: this.refs[ 'domComponent' ]
    }, 'field')
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey, 'field')
  }

  componentWillReceiveProps (nextProps) {
    this.props.setFieldMount(nextProps.fieldKey, {
      ref: this.refs[ 'field' ],
      refComponent: this,
      refDomComponent: this.refs[ 'domComponent' ]
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (vcCake.env('EDIT_FORM_ACCORDION')) {
      this.updateAccordionSectionDependency(prevState)
    }
  }

  /**
   * Check if dependency state differs from previous and update accordion section state
   * @param prevState
   */
  updateAccordionSectionDependency (prevState) {
    if (this.props.fieldKey === this.props.tab.fieldKey &&
      this.state.dependenciesClasses.length &&
      this.state.dependenciesClasses.length !== prevState.dependenciesClasses.length &&
      this.state.dependenciesClasses.length === 1
    ) {
      this.props.updateDependencies(this.state.dependenciesClasses)
    }
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)

    return (
      <div ref='field' className={classes}>
        <Field ref='domComponent'
          {...this.props}
        />
      </div>
    )
  }
}
