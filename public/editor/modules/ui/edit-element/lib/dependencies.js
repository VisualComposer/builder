import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const RulesManager = vcCake.getService('rules-manager')
const ActionsManager = vcCake.getService('actions-manager')

class DependencyManager extends React.Component {
  constructor (props) {
    super(props)
    this.mount = false
    this.stack = []
  }

  componentWillMount () {
    // Before render
    let { onChange } = this.props.data.options
    if (onChange) {
      this.props.api.on('element:set', this.onElementChange.bind(this))
      this.props.api.on('form:mount', this.callActivitiesAfterMount.bind(this))
    }
  }

  componentWillUnmount () {
    this.props.api.off('element:set', this.onElementChange.bind(this))
    this.props.api.off('form:mount', this.callActivitiesAfterMount.bind(this))
  }

  callActivitiesAfterMount () {
    this.mount = true
    if (this.stack) {
      this.stack = this.stack.filter((item) => {
        let { key, value, rules } = item
        let { updater, getRef, getRefTab } = this.props.data
        let target = {
          key: key,
          value: value,
          updater: updater,
          ref: getRef(key),
          getRef: getRef,
          getRefTab: getRefTab
        }
        let current = {
          key: this.props.data.key,
          value: this.props.data.value,
          updater: updater,
          ref: getRef(this.props.data.key),
          getRef: getRef,
          getRefTab: getRefTab
        }
        rules.forEach((ruleData) => {
          let actionsCallback = (ruleState) => {
            if (ruleData.current) {
              ruleData.current.forEach((action) => {
                ActionsManager.do(action, ruleState, current)
              })
            }
            if (ruleData.target) {
              ruleData.target.forEach((action) => {
                ActionsManager.do(action, ruleState, target)
              })
            }
          }

          RulesManager.check(ruleData, value, actionsCallback)
        })
      })
    }
  }

  onElementChange (data) {
    let { key, value } = data
    let { onChange } = this.props.data.options
    if (key === this.props.data.key) {
      this.props.data.value = value
    }
    // Only if hook for attribute exists
    if (onChange[ key ]) {
      let action = {
        key: key,
        value: value,
        rules: onChange[ key ]
      }
      this.stack.push(action)
      if (this.mount) {
        this.callActivitiesAfterMount()
      }
    }
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
  data: React.PropTypes.object.isRequired
}

module.exports = DependencyManager
