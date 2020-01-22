import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const utils = vcCake.getService('utils')

export default class PanelNavigation extends React.Component {
  buttonsGroup = null
  static propTypes = {
    controls: PropTypes.object.isRequired,
    activeSection: PropTypes.string.isRequired,
    setActiveSection: PropTypes.func.isRequired,
    activeSubControl: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      totalControlWidth: 0,
      isControlsHidden: true
    }
    this.handleResize = this.handleResize.bind(this)
    this.getDropdownItems = this.getDropdownItems.bind(this)

    this.handleDropdownChange = this.handleDropdownChange.bind(this)
    this.getSelectOptions = this.getSelectOptions.bind(this)
  }

  componentDidMount () {
    this.setState({ totalControlWidth: this.getControlsTotalWidth() })
    this.handleResize()
    utils.addResizeListener(ReactDOM.findDOMNode(this), {}, this.handleResize)
  }

  componentWillUnmount () {
    utils.removeResizeListener(ReactDOM.findDOMNode(this), {}, this.handleResize)
  }

  getControlsTotalWidth () {
    return this.buttonsGroup.getBoundingClientRect().width
  }

  handleResize () {
    const wrapperWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width
    const { isControlsHidden, totalControlWidth } = this.state
    const controlsWidth = totalControlWidth || this.getControlsTotalWidth()
    if (wrapperWidth >= controlsWidth && isControlsHidden) {
      this.setState({ isControlsHidden: false })
    } else if (wrapperWidth < controlsWidth && !isControlsHidden) {
      this.setState({ isControlsHidden: true })
    }
  }

  handleClick (type, index, activeSubControl) {
    this.props.setActiveSection(type, index, activeSubControl)
  }

  getControls () {
    const controls = Object.values(this.props.controls)
    return controls.map((control, i) => {
      const { type, title, subControls } = control
      const isActive = type === this.props.activeSection
      const controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': isActive
      })
      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      let subControlsContent = null
      if (subControls && subControls.length) {
        subControlsContent = (
          <div className='vcv-ui-form-button-group-dropdown'>
            {this.getDropdownItems(subControls, type, index, isActive)}
          </div>
        )
      }

      return (
        <div key={`panel-control-${type}-${i}`} className='vcv-ui-form-button-group-item'>
          <button type='button' onClick={() => this.handleClick(type, index)} className={controlClasses}>
            {title}
          </button>
          {subControlsContent}
        </div>
      )
    })
  }

  getDropdownItems (subControls, type, categoryIndex, isActive) {
    return subControls.map((activeSubControl) => {
      const subControlType = activeSubControl.type
      const subControlTitle = activeSubControl.title
      const dropdownItemClasses = classNames({
        'vcv-ui-form-button-group-dropdown-item': true,
        'vcv-ui-form-button-group-dropdown-item--active': isActive && subControlType === this.props.activeSubControl
      })

      return (
        <button
          key={`panel-control-dropdown-item-${subControlType}`}
          type='button'
          onClick={() => this.handleClick(type, categoryIndex, subControlType)}
          className={dropdownItemClasses}
        >
          {subControlTitle}
        </button>
      )
    })
  }

  createGroup (subControls, type, index, title) {
    const optionElements = []

    optionElements.push(this.createOptions(type, index, title))

    subControls.forEach((activeSubControl) => {
      const subControlTitle = activeSubControl.title
      const subControlType = activeSubControl.type

      optionElements.push(this.createOptions(type, index, subControlTitle, subControlType))
    })

    return <optgroup key={`panel-dropdown-optGroup-${type}-${index}`} label={title}>{optionElements}</optgroup>
  }

  createOptions (type, index, title, activeSubControl) {
    const value = activeSubControl ? `${type}_${index}_${activeSubControl}` : `${type}_${index}`
    const key = activeSubControl ? `panel-dropdown-option-${type}-${index}-${activeSubControl}` : `panel-dropdown-option-${type}-${index}`
    return <option key={key} value={value}>{title}</option>
  }

  getSelectOptions () {
    const { controls } = this.props
    const controlValues = Object.values(controls)

    return controlValues.map((control) => {
      const { type, title, subControls } = control

      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      if (subControls && subControls.length) {
        return this.createGroup(subControls, type, index, title)
      } else {
        return this.createOptions(type, index, title)
      }
    })
  }

  handleDropdownChange (event) {
    const value = event.target.value
    const splitValue = value.split('_')
    this.props.setActiveSection(splitValue[0], splitValue[1], splitValue[2])
  }

  render () {
    const controlContainerClasses = classNames({
      'vcv-ui-panel-controls-container': true,
      'vcv-is-hidden': this.state.isControlsHidden
    })

    const { controls, activeSection, activeSubControl } = this.props
    const activeCategory = controls[activeSection]
    const { subIndex, index, type } = activeCategory
    const newIndex = subIndex !== undefined ? `${index}-${subIndex}` : index
    const value = activeSubControl ? `${type}_${newIndex}_${activeSubControl}` : `${type}_${newIndex}`

    let isControlsHiddenContent
    if (this.state.isControlsHidden) {
      isControlsHiddenContent = (
        <div className='vcv-ui-panel-dropdown-container'>
          <select className='vcv-ui-form-dropdown' value={value} onChange={this.handleDropdownChange}>
            {this.getSelectOptions()}
          </select>
        </div>
      )
    }

    return (
      <div className='vcv-ui-panel-navigation-container'>
        <div className={controlContainerClasses}>
          <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large' ref={buttonsGroup => { this.buttonsGroup = buttonsGroup }}>
            {this.getControls()}
          </div>
        </div>
        {isControlsHiddenContent}
      </div>
    )
  }
}
