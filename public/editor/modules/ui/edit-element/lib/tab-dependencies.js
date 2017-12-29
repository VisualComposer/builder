import React from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import Tab from './tab'
import PropTypes from 'prop-types'

const Utils = vcCake.getService('utils')

export default class TabDependencyManager extends React.Component {
  static propTypes = {
    element: PropTypes.shape({
      get: PropTypes.func.isRequired
    }).isRequired,
    fieldKey: PropTypes.string.isRequired,
    setFieldMount: PropTypes.func.isRequired,
    setFieldUnmount: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired
  }
  state = {
    dependenciesClasses: []
  }
  realWidth = null

  getRealWidth () {
    if (this.realWidth === null) {
      this.realWidth = Utils.getRealWidth(ReactDOM.findDOMNode(this), this.props.getContainer())
    }

    return this.realWidth
  }

  componentDidMount () {
    this.props.setFieldMount(this.props.fieldKey, {
      ref: this.refs[ 'tab' ],
      refComponent: this,
      refDomComponent: this.refs[ 'domComponent' ]
    }, 'tab')
  }

  componentWillUnmount () {
    this.props.setFieldUnmount(this.props.fieldKey, 'tab')
  }

  render () {
    let classes = classNames({
      'vcv-ui-form-dependency': true
    }, this.state.dependenciesClasses)

    return (
      <div ref='tab' className={classes}>
        <Tab
          ref='domComponent'
          {...this.props}
          key={`form-tab-${this.props.element.get('id')}:${this.props.fieldKey}`}
        />
      </div>
    )
  }
}
