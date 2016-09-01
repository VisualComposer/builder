import React from 'react'
// import vcCake from 'vc-cake'
//
// const RulesManager = vcCake.getService('rules-manager')
// const ActionsManager = vcCake.getService('actions-manager')

export default class ActivitiesManager extends React.Component {
  mount = []
  stack = []

  setFieldMount = (field) => {
    console.log('ActivitiesManager.setFieldMount', field)
    this.mount[ field ] = true
    // this.callFieldActivities(field)
  }

  setFieldUnmount = (field) => {
    console.log('ActivitiesManager.setFieldUnmount', field)
    this.mount[ field ] = false
  }

  isMount = (field) => {
    return !!this.mount[ field ]
  }

  callFieldActivities = (field) => {
    if (this.stack[ field ]) {
      this.stack[ field ] = this.stack[ field ].filter((action) => {
        action()
      })
    }
  }

  addStack (stack) {
    console.log('added stack', stack)
    /*
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
     */
  }

  render () {
    return null
  }
}
