import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import '../../../../../sources/less/wpbackend/representers/init.less'

const categories = getService('categories')
const cook = getService('cook')

export default class DefaultElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      activeElement: true,
      activeAttribute: false,
      element: props.element
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleDropdownSize = this.handleDropdownSize.bind(this)
  }

  // Lifecycle

  componentWillMount () {
    let cookElement = cook.get({ tag: this.state.element.tag })
    if (!cookElement.get('metaBackendLabels')) {
      this.setState({ activeElement: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ element: nextProps })
  }

  // Events

  handleClick () {
    let isActive = !this.state.activeAttribute
    this.setState({ activeAttribute: isActive })
    if (isActive) {
      this.handleDropdownSize()
      window.addEventListener('resize', this.handleDropdownSize)
    } else {
      window.removeEventListener('resize', this.handleDropdownSize)
    }
  }

  handleDropdownSize () {
    let container = ReactDOM.findDOMNode(this)
    let attrDropdown = container.querySelector('.vce-wpbackend-element-attributes')
    if (attrDropdown) {
      let size = container.getBoundingClientRect()
      let styles = window.getComputedStyle(container)
      attrDropdown.style.width = `${size.width}px`
      attrDropdown.style.left = `${0 - parseInt(styles.borderLeftWidth)}px`
      attrDropdown.style.top = `${size.height - parseInt(styles.borderBottomWidth)}px`
    }
    // TODO: handle block preview if title doesn't fit
  }

  // Getters

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

  getRepresenter (element) {
    let cookElement = cook.get({tag: element.tag})
    let backendLabels = cookElement.get('metaBackendLabels').value
    return backendLabels.map((label) => {
      if (this.getDependency(label, element, cookElement)) {
        return null
      }
      let RepresenterComponent = cookElement.settings(label).type.getRepresenter('Backend')
      return <RepresenterComponent
        key={`representer-${label}-${cookElement.get('id')}`}
        fieldKey={label}
        value={element[label]}
        {...this.props}
      />
    })
  }

  render () {
    const { element, activeAttribute, activeElement } = this.state
    let icon = categories.getElementIcon(element.tag, true)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes': true,
      'vce-wpbackend-hidden': !activeAttribute
    })

    let headerClasses = classNames({
      'vce-wpbackend-element-header': true,
      'vce-wpbackend-element-header-closed': !activeAttribute,
      'vce-wpbackend-element-header-opened': activeAttribute
    })

    if (activeElement) {
      return <div className='vce-wpbackend-element-container'>
        <div className={headerClasses} onClick={this.handleClick}>
          <div className='vce-wpbackend-element-header-icon'>
            <img src={icon} alt={element.name} title={element.name} />
          </div>
          <div className='vce-wpbackend-element-header-name-wrapper'>
            <span className='vce-wpbackend-element-header-name'>{element.name}</span>
          </div>
        </div>
        <div className={attributesClasses}>
          {this.getRepresenter(element)}
        </div>
      </div>
    }
    return <div className='vce-wpbackend-element-container'>
      <div className='vce-wpbackend-element-header'>
        <div className='vce-wpbackend-element-header-icon'>
          <img src={icon} alt={element.name} title={element.name} />
        </div>
        <div className='vce-wpbackend-element-header-name-wrapper'>
          <span className='vce-wpbackend-element-header-name'>{element.name}</span>
        </div>
      </div>
    </div>
  }
}
