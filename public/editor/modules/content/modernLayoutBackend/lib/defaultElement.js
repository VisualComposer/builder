import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import '../../../../../sources/less/wpbackend/representers/init.less'

// const categories = getService('categories')
const hubCategoriesService = getService('hubCategories')
const cook = getService('cook')
const elementsStorage = getStorage('elements')

export default class DefaultElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired,
    layoutWidth: React.PropTypes.number.isRequired
  }

  elementContainer = null
  receivePropsTimeout = 0

  constructor (props) {
    super(props)
    this.state = {
      hasAttributes: true,
      element: props.element,
      activeElement: false,
      attributeState: 'closed'
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleElementSize = this.handleElementSize.bind(this)
    this.dataUpdate = this.dataUpdate.bind(this)
  }

  // Lifecycle

  componentWillMount () {
    let cookElement = cook.get({ tag: this.state.element.tag })
    if (!cookElement.get('metaBackendLabels')) {
      this.setState({ hasAttributes: false })
    }
    elementsStorage.state('element:' + this.props.element.id).onChange(this.dataUpdate)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.layoutWidth !== this.props.layoutWidth) {
      this.setState({ element: nextProps.element })
      this.receivePropsTimeout = setTimeout(() => {
        this.handleElementSize()
      }, 1)
    }
  }

  componentWillUnmount () {
    if (this.receivePropsTimeout) {
      this.receivePropsTimeout = 0
    }
    elementsStorage.state('element:' + this.props.element.id).ignoreChange(this.dataUpdate)
  }

  dataUpdate (data) {
    this.setState({ element: data || this.props.element })
  }

  // Events

  handleClick () {
    let { attributeState } = this.state
    if (attributeState === 'closed') {
      this.setState({
        activeElement: true,
        attributeState: 'opened'
      })
    } else {
      this.setState({
        activeElement: false,
        attributeState: 'closed'
      })
    }
  }

  handleElementSize () {
    if (this.state.attributeState === 'opened') {
      const header = this.getElementData('.vce-wpbackend-element-header-container')
      header.width < 100 ? this.setState({ activeElement: false }) : this.setState({ activeElement: true })
    }
  }

  // Getters

  getElementData (className) {
    return this.elementContainer.querySelector(className).getBoundingClientRect()
  }

  getDependency (group, label, element) {
    let isDependency, isRuleTrue
    let options = group.options
    if (options && options.onChange) {
      isDependency = options.onChange.find((option) => {
        return option.dependency === label
      })
      if (isDependency) {
        isRuleTrue = isDependency.rule.value === element[ isDependency.rule.attribute ]
      }
    }
    return isRuleTrue
  }

  getGroupAttributes (element, group) {
    let cookElement = cook.get({ tag: element.tag })
    return group.value.map((label) => {
      if (this.getDependency(group, label, element)) {
        return null
      }
      let RepresenterComponent = cookElement.settings(label).type.getRepresenter('Backend')
      return <RepresenterComponent
        key={`representer-${label}-${cookElement.get('id')}`}
        fieldKey={label}
        value={element[ label ]}
        {...this.props}
      />
    })
  }

  getRepresenter (element) {
    let cookElement = cook.get({ tag: element.tag })
    let backendLabelGroups = cookElement.get('metaBackendLabels').value
    return backendLabelGroups.map((group, i) => {
      return <div
        className='vce-wpbackend-element-attributes-group'
        key={`attributes-group-${i}`}
      >
        {this.getGroupAttributes(element, group)}
      </div>
    })
  }

  render () {
    const { element, hasAttributes, activeElement } = this.state
    let icon = hubCategoriesService.getElementIcon(element.tag, true)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes-container': true,
      'vce-wpbackend-hidden': !activeElement
    })

    let arrowClasses = classNames({
      'vce-wpbackend-element-arrow': true,
      'vce-wpbackend-element-arrow-closed': !activeElement,
      'vce-wpbackend-element-arrow-opened': activeElement
    })

    if (hasAttributes) {
      return <div
        className='vce-wpbackend-element-container'
        id={`el-${element.id}-temp`}
        data-vcv-element={element.id}
        ref={(container) => { this.elementContainer = container }}
      >
        <div className='vce-wpbackend-element-header-container'>
          <div className='vce-wpbackend-element-header'>
            <div className='vce-wpbackend-element-icon-container'>
              <img
                className='vce-wpbackend-element-icon'
                src={icon}
                alt={element.name}
                title={element.name}
              />
            </div>
            <div className='vce-wpbackend-element-name-container'>
              <span className='vce-wpbackend-element-name'>{element.name}</span>
            </div>
            <div className={arrowClasses} />
            <div className='vce-wpbackend-element-header-overlay' onClick={this.handleClick} />
          </div>
        </div>
        <div className={attributesClasses}>
          {this.getRepresenter(element)}
        </div>
      </div>
    }
    return <div
      className='vce-wpbackend-element-container'
      id={`el-${element.id}-temp`}
      data-vcv-element={element.id}
      ref={(container) => { this.elementContainer = container }}
    >
      <div className='vce-wpbackend-element-header-container'>
        <div className='vce-wpbackend-element-header'>
          <div className='vce-wpbackend-element-icon-container'>
            <img
              className='vce-wpbackend-element-icon'
              src={icon}
              alt={element.name}
              title={element.name}
            />
          </div>
          <div className='vce-wpbackend-element-name-container'>
            <span className='vce-wpbackend-element-name'>{element.name}</span>
          </div>
        </div>
      </div>
    </div>
  }
}
