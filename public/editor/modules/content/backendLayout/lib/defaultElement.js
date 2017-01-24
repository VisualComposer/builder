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
    api: React.PropTypes.object.isRequired,
    openElement: React.PropTypes.func.isRequired,
    activeElementId: React.PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      hasAttributes: true,
      element: props.element
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleDropdownSize = this.handleDropdownSize.bind(this)
  }

  // Lifecycle

  componentWillMount () {
    let cookElement = cook.get({ tag: this.state.element.tag })
    if (!cookElement.get('metaBackendLabels')) {
      this.setState({ hasAttributes: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ element: nextProps.element })
  }

  // Events

  handleClick () {
    let { activeElementId, element, openElement } = this.props
    if (activeElementId === element.id) {
      openElement('')
      window.removeEventListener('resize', this.handleDropdownSize)
    } else {
      openElement(element.id)
      this.handleDropdownSize()
      window.addEventListener('resize', this.handleDropdownSize)
    }
  }

  handleDropdownSize () {
    let container = ReactDOM.findDOMNode(this)
    let attrDropdown = container.querySelector('.vce-wpbackend-element-attributes')
    let layout = document.querySelector('.vcv-wpbackend-layout')
    if (attrDropdown) {
      let size = container.getBoundingClientRect()
      let styles = window.getComputedStyle(container)
      let layoutStyles = window.getComputedStyle(layout)
      let layoutSize = layout.getBoundingClientRect()
      let layoutLeft = layoutSize.left + parseInt(layoutStyles.paddingLeft)
      let containerLeft = size.left
      let diff = containerLeft - layoutLeft
      let dropdownPos = 0 - diff - parseInt(styles.borderLeftWidth)
      attrDropdown.style.width = `${layoutSize.width - parseInt(layoutStyles.paddingLeft) - parseInt(layoutStyles.paddingRight)}px`
      attrDropdown.style.left = `${dropdownPos}px`
      attrDropdown.style.top = `${size.height - parseInt(styles.borderBottomWidth) - parseInt(styles.borderTopWidth)}px`
    }
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
    const { element, hasAttributes } = this.state
    const { activeElementId } = this.props
    let icon = categories.getElementIcon(element.tag, true)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes': true,
      'vce-wpbackend-hidden': activeElementId !== element.id
    })

    let headerClasses = classNames({
      'vce-wpbackend-element-header': true,
      'vce-wpbackend-element-header-closed': activeElementId !== element.id,
      'vce-wpbackend-element-header-opened': activeElementId === element.id
    })
    if (hasAttributes) {
      return <div className='vce-wpbackend-element-container' data-vcv-element={element.id}>
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
    return <div className='vce-wpbackend-element-container' data-vcv-element={element.id}>
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
