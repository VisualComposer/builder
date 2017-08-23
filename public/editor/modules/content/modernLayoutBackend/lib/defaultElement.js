import React from 'react'
import classNames from 'classnames'
import {env, getService, getStorage} from 'vc-cake'

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
      attributeState: 'closed',
      content: props.element.customHeaderTitle || props.element.name,
      editable: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleElementSize = this.handleElementSize.bind(this)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.enableEditable = this.enableEditable.bind(this)
    this.validateContent = this.validateContent.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.preventNewLine = this.preventNewLine.bind(this)
  }

  // Lifecycle

  componentWillMount () {
    let cookElement = cook.get({ tag: this.state.element.tag })
    if (!cookElement.get('metaBackendLabels')) {
      this.setState({ hasAttributes: false })
    }
    // elementsStorage.state('element:' + this.props.element.id).onChange(this.dataUpdate)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.layoutWidth !== this.props.layoutWidth) {
      this.receivePropsTimeout = setTimeout(() => {
        this.handleElementSize()
      }, 1)
    }
    this.dataUpdate(nextProps.element)
  }

  componentWillUnmount () {
    if (this.receivePropsTimeout) {
      this.receivePropsTimeout = 0
    }
    // elementsStorage.state('element:' + this.props.element.id).ignoreChange(this.dataUpdate)
  }

  dataUpdate (data) {
    this.setState({ element: data || this.props.element })
    if (data && data.hasOwnProperty('customHeaderTitle')) {
      let content = data.customHeaderTitle || data.name
      if (this.state.content !== content) {
        this.setState({
          content
        }, () => {
          this.span.innerText = content
        })
      }
    }
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
      const header = this.getElementRect('.vce-wpbackend-element-header-container')
      header.width < 100
        ? this.setState({ activeElement: false, attributeState: 'closed' })
        : this.setState({ activeElement: true, attributeState: 'opened' })
    }
  }

  // Getters

  getElementRect (className) {
    return this.elementContainer.querySelector(className).getBoundingClientRect()
  }

  getDependency (group, label, element) {
    let isDependency, isRuleTrue
    let { options } = group
    if (options && options.onChange) {
      isDependency = options.onChange.find((option) => {
        return option.dependency === label
      })
      if (isDependency && isDependency.rule) {
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
      return RepresenterComponent ? <RepresenterComponent
        key={`representer-${label}-${cookElement.get('id')}`}
        fieldKey={label}
        value={element[ label ]}
        element={cookElement.toJS()}
        {...this.props}
      /> : null
    })
  }

  getRepresenters (element) {
    let cookElement = cook.get({ tag: element.tag })
    let backendLabelGroups = cookElement.get('metaBackendLabels').value
    return backendLabelGroups.map((group, i) => {
      const { options } = group
      // check for group dependency existance
      if (options && options.groupDependency && options.groupDependency.rule) {
        if (options.groupDependency.rule.value === element[ options.groupDependency.rule.attribute ]) {
          return null
        }
      }
      return <div
        className='vce-wpbackend-element-attributes-group'
        key={`attributes-group-${i}`}
      >
        {this.getGroupAttributes(element, group)}
      </div>
    })
  }

  enableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span.focus()
    })
  }

  editTitle () {
    this.enableEditable()
    let range = document.createRange()
    let selection = window.getSelection()
    range.selectNodeContents(this.span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateContent (value) {
    let element = cook.get(this.props.element)
    element.set('customHeaderTitle', value)
    let elementData = element.toJS()
    elementsStorage.trigger('update', elementData.id, elementData, 'editFormTitle')
    this.setState({
      content: value || element.get('name'),
      editable: false
    }, () => {
      if (!value) {
        this.span.innerText = element.get('name')
      }
    })
  }

  validateContent () {
    let value = this.span.innerText.trim()
    this.updateContent(value)
  }

  preventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span.blur()
      this.validateContent()
    }
  }

  render () {
    const { element, hasAttributes, activeElement, editable, content } = this.state
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

    let nameContainerClasses = classNames({
      'vce-wpbackend-element-name-container': true,
      'vce-wpbackend-element-name-container-editable': editable
    })

    let envContent = (
      <div className='vce-wpbackend-element-name-container'>
        <span className='vce-wpbackend-element-name'>{element.name}</span>
      </div>

    )

    if (env('FEATURE_RENAME_ELEMENT')) {
      envContent = (
        <div className={nameContainerClasses}>
          <span className='vce-wpbackend-element-name'
            ref={span => { this.span = span }}
            contentEditable={editable}
            suppressContentEditableWarning
            onClick={this.enableEditable}
            onKeyDown={this.preventNewLine}
            onBlur={this.validateContent}>
            {content}
          </span>
          <i className='vcv-ui-outline-control-icon vcv-ui-icon vcv-ui-icon-edit vce-wpbackend-element-name-icon'
            onClick={this.editTitle} />
        </div>
      )
    }

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
            {envContent}
            <div className={arrowClasses} />
            <div className='vce-wpbackend-element-header-overlay' onClick={this.handleClick} />
          </div>
        </div>
        <div className={attributesClasses}>
          {this.getRepresenters(element)}
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
          {envContent}
        </div>
      </div>
    </div>
  }
}
