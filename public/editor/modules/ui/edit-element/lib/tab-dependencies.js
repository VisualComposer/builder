import React from 'react'
import classNames from 'classnames'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import Tab from './tab'

const Utils = vcCake.getService('utils')

export default class TabDependencyManager extends React.Component {
  static propTypes = {
    element: React.PropTypes.shape({
      get: React.PropTypes.func.isRequired
    }).isRequired,
    fieldKey: React.PropTypes.string.isRequired,
    setFieldMount: React.PropTypes.func.isRequired,
    setFieldUnmount: React.PropTypes.func.isRequired,
    getContainer: React.PropTypes.func.isRequired
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
      refComponent: this
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
        <Tab
          {...this.props}
          key={`form-tab-${this.props.element.get('id')}:${this.props.fieldKey}`}
        />
      </div>
    )
  }
}
