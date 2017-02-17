import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import vcCake from 'vc-cake'
const Cook = vcCake.getService('cook')

export default class Backend extends Representer {
  getDependency (group, label, element) {
    let isDependency, isRuleTrue
    let options = group.options
    if (options && options.onChange) {
      isDependency = options.onChange.find((option) => {
        return option.dependency === label
      })
      if (isDependency) {
        isRuleTrue = isDependency.rule.value === element[isDependency.rule.attribute]
      }
    }
    return isRuleTrue
  }

  getGroupAttributes (cookElement, group) {
    let cookElementJs = cookElement.toJS()
    return group.value.map((label) => {
      if (this.getDependency(group, label, cookElementJs)) {
        return null
      }
      let RepresenterComponent = cookElement.settings(label).type.getRepresenter('Backend')
      return <RepresenterComponent
        key={`representer-element-${label}-${cookElement.get('id')}`}
        fieldKey={label}
        value={cookElementJs[label]}
        element={cookElementJs}
        api={this.props.api}
      />
    })
  }

  getOutput (value) {
    let cookElement = Cook.get(value)
    let backendLabels = cookElement.get('metaBackendLabels').value
    return backendLabels.map((group, i) => {
      return <div
        className='vce-wpbackend-element-attributes-group'
        key={`attributes-group-${i}`}
      >
        {this.getGroupAttributes(cookElement, group)}
      </div>
    })
  }

  render () {
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-element': true
    })

    return <div className={classes}>
      {this.getOutput(this.props.value)}
    </div>
  }
}
