import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import vcCake from 'vc-cake'
const Cook = vcCake.getService('cook')

export default class Backend extends Representer {
  getDependency (label, element, cookElement) {
    let isDependency, isRuleTrue
    let options = cookElement.settings('metaBackendLabels').settings.options
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

  render () {
    let { value } = this.props
    let cookElement = Cook.get(value)
    let cookElementJs = cookElement.toJS()
    let backendLabels = cookElement.get('metaBackendLabels').value
    let output = backendLabels.map((label) => {
      if (this.getDependency(label, cookElementJs, cookElement)) {
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
    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-element': true
    })

    return <div className={classes}>
      {output}
    </div>
  }
}
