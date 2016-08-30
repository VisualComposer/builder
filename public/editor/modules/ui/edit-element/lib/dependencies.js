import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const RulesManager = vcCake.getService('rules-manager')
const ActionsManager = vcCake.getService('actions-manager')

class DependencyManager extends React.Component {
  mount = []
  stack = []

  componentWillMount () {
    // Before render
    let { onChange } = this.props.data.options
    if (onChange) {
      this.props.api.on('element:set', this.onElementChange)
      this.props.api.on('field:mount', this.setFieldMount)
      this.props.api.on('field:unmount', this.setFieldUnmount)
      this.props.api.on('field:mount', this.callFieldActivities)
      // this.props.api.on('tab:mount', this.callTabActivitiesAfterMount)
    }
  }

  componentWillUnmount () {
    let { onChange } = this.props.data.options
    if (onChange) {
      this.props.api.off('element:set', this.onElementChange)
      this.props.api.off('field:mount', this.setFieldMount)
      this.props.api.off('field:unmount', this.setFieldUnmount)
      this.props.api.off('field:mount', this.callFieldActivities)
      // this.props.api.off('tab:mount', this.callTabActivitiesAfterMount)
    }
  }

  setFieldMount = (field) => {
    this.mount[ field ] = true
  }

  setFieldUnmount = (field) => {
    this.mount[ field ] = false
  }

  callFieldActivities = (field) => {
    if (this.stack[ field ]) {
      this.stack[ field ] = this.stack[ field ].filter((action) => {
        action()
      })
    }
  }

  onElementChange = (data) => {
    let { key, value } = data
    let { onChange } = this.props.data.options
    if (key === this.props.data.key) {
      this.props.data.value = value
    }
    // Only if hook for attribute exists
    if (onChange[ key ]) {
      let stack = {
        key: key,
        value: value,
        rules: onChange[ key ]
      }
      this.addStack(stack)
    }
  }

  addStack (stack) {
    let { key, value, rules } = stack
    let { updater, getRef } = this.props.data
    rules.forEach((ruleData) => {
      let actionsCallback = (ruleState) => {
        if (ruleData.current) {
          if (!this.stack[ this.props.data.key ]) {
            this.stack[ this.props.data.key ] = []
          }
          this.stack[ this.props.data.key ].push(() => {
            let current = {
              key: this.props.data.key,
              value: this.props.data.value,
              updater: updater,
              ref: getRef(this.props.data.key),
              getRef: getRef
            }
            ruleData.current.forEach((action) => {
              ActionsManager.do(action, ruleState, current)
            })
          })
          if (this.mount[ this.props.data.key ]) {
            this.callFieldActivities(this.props.data.key)
          }
        }
        if (ruleData.target) {
          ruleData.target.forEach((action) => {
            if (!this.stack[ key ]) {
              this.stack[ key ] = []
            }
            this.stack[ key ].push(() => {
              let target = {
                key: key,
                value: value,
                updater: updater,
                ref: getRef(key),
                getRef: getRef
              }
              ruleData.current.forEach((action) => {
                ActionsManager.do(action, ruleState, target)
              })
            })
            if (this.mount[ key ]) {
              this.callFieldActivities(key)
            }
          })
        }
      }

      RulesManager.check(ruleData, value, actionsCallback)
    })
  }

  render () {
    let { content } = this.props
    let classes = classNames({
      'vcv-ui-form-dependency': true
    })

    return (
      <div className={classes}>
        {content}
      </div>
    )
  }
}
DependencyManager.propTypes = {
  api: React.PropTypes.object.isRequired,
  element: React.PropTypes.object.isRequired,
  content: React.PropTypes.object.isRequired,
  data: React.PropTypes.shape({
    options: React.PropTypes.object.isRequired,
    key: React.PropTypes.string.isRequired,
    type: React.PropTypes.object.isRequired,
    value: React.PropTypes.any.isRequired,
    rawValue: React.PropTypes.any.isRequired,
    updater: React.PropTypes.func.isRequired,
    getRef: React.PropTypes.func.isRequired
  }).isRequired
}

export default DependencyManager
