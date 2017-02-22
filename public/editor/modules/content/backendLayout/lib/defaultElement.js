import React from 'react'
import classNames from 'classnames'
import { getService } from 'vc-cake'
import _ from 'lodash'
import '../../../../../sources/less/wpbackend/representers/init.less'

const categories = getService('categories')
const cook = getService('cook')

export default class DefaultElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }

  elementContainer = null

  constructor (props) {
    super(props)
    this.state = {
      hasAttributes: true,
      element: props.element,
      isName: true,
      isArrow: true,
      activeElement: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleElementSize = _.debounce(this.handleElementSize.bind(this), 150)
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

  componentDidMount () {
    this.handleElementSize()
    this.addResizeListener(this.elementContainer, this.handleElementSize)
  }

  componentWillUnmount () {
    this.removeResizeListener(this.elementContainer, this.handleElementSize)
  }

  // Events

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      console.log('test')
      this.contentDocument.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  handleClick () {
    let { activeElement } = this.state
    this.setState({ activeElement: !activeElement })
  }

  handleElementSize () {
    let header = this.getElementData('.vce-wpbackend-element-header')
    let { isName, isArrow } = this.state

    if (isArrow && header.width < 100) {
      this.setState({ isArrow: false })
    } else if (!isArrow && header.width > 100) {
      this.setState({ isArrow: true })
    }

    if (isName && header.width < 70) {
      this.setState({ isName: false })
    } else if (!isName && header.width > 70) {
      this.setState({ isName: true })
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
    const { element, hasAttributes, isName, isArrow, activeElement } = this.state
    let icon = categories.getElementIcon(element.tag, true)
    let attributesClasses = classNames({
      'vce-wpbackend-element-attributes-container': true,
      'vce-wpbackend-hidden': !activeElement || !isArrow
    })

    let headerClasses = classNames({
      'vce-wpbackend-element-header': true,
      'vce-wpbackend-element-header-closed': !activeElement,
      'vce-wpbackend-element-header-opened': activeElement,
      'vce-wpbackend-element-header-no-arrow': !isArrow,
      'vce-wpbackend-element-header-icon-only': !isName
    })

    let nameClasses = classNames({
      'vce-wpbackend-element-header-name-wrapper': true,
      'vce-wpbackend-hidden': !isName
    })

    if (hasAttributes) {
      return <div
        className='vce-wpbackend-element-container'
        data-vcv-element={element.id}
        ref={(container) => { this.elementContainer = container }}
      >
        <div className={headerClasses} onClick={this.handleClick}>
          <div className='vce-wpbackend-element-header-icon-container'>
            <img
              className='vce-wpbackend-element-header-icon'
              src={icon}
              alt={element.name}
              title={element.name}
            />
          </div>
          <div className={nameClasses}>
            <span className='vce-wpbackend-element-header-name'>{element.name}</span>
          </div>
        </div>
        <div className={attributesClasses}>
          {this.getRepresenter(element)}
        </div>
      </div>
    }
    return <div
      className='vce-wpbackend-element-container'
      data-vcv-element={element.id}
      ref={(container) => { this.elementContainer = container }}
    >
      <div className='vce-wpbackend-element-header vce-wpbackend-element-header-no-arrow'>
        <div className='vce-wpbackend-element-header-icon-container'>
          <img
            className='vce-wpbackend-element-header-icon'
            src={icon}
            alt={element.name}
            title={element.name}
          />
        </div>
        <div className='vce-wpbackend-element-header-name-wrapper'>
          <span className='vce-wpbackend-element-header-name'>{element.name}</span>
        </div>
      </div>
    </div>
  }
}
