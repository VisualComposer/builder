import React from 'react'
import vcCake from 'vc-cake'
import TemplatePreview from './templatePreview'
import LayoutIcons from './layoutIcons/index'
import Permalink from 'public/components/permalink/permalink'

const templateManager = vcCake.getService('myTemplates')
const Utils = vcCake.getService('utils')
const dataManager = vcCake.getService('dataManager')
const settingsStorage = vcCake.getStorage('settings')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

const pageLayouts = dataManager.get('pageTemplatesLayouts')
const localizations = dataManager.get('localizations')

export default class PagePanelContent extends React.Component {
  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null

  constructor (props) {
    super(props)

    const currentTemplate = settingsStorage.state('pageTemplate').get() || dataManager.get('pageTemplatesLayoutsCurrent')
    if (currentTemplate && currentTemplate.type && currentTemplate.value) {
      settingsStorage.state('pageTemplate').set(currentTemplate)
    }

    this.state = {
      templates: templateManager.predefined(),
      current: currentTemplate,
      title: settingsStorage.state('pageTitle').get() || ''
    }

    this.handleLayoutClick = this.handleLayoutClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleAddElementClick = this.handleAddElementClick.bind(this)
    this.handleAddTemplateClick = this.handleAddTemplateClick.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.updatePageTitle = this.updatePageTitle.bind(this)
  }

  componentDidMount () {
    this.setControlData()
    // set timeout to get new state data from setControlData()
    this.initialSetControlsLayoutTimeout = setTimeout(() => {
      this.setControlsLayout()
    }, 1)
    Utils.addResizeListener(this.rowContainer, {}, this.setControlsLayout)
    settingsStorage.state('pageTemplate').onChange(this.updateState)
    settingsStorage.state('pageTitle').onChange(this.updatePageTitle)
  }

  componentWillUnmount () {
    Utils.removeResizeListener(this.rowContainer, {}, this.setControlsLayout)
    if (this.initialSetControlsLayoutTimeout) {
      window.clearTimeout(this.initialSetControlsLayoutTimeout)
      this.initialSetControlsLayoutTimeout = null
    }
    settingsStorage.state('pageTemplate').ignoreChange(this.updateState)
    settingsStorage.state('pageTitle').ignoreChange(this.updatePageTitle)
  }

  updateState (data) {
    if (data) {
      this.setState({
        current: data
      })
    }
  }

  updatePageTitle (title) {
    if (title || title === '') {
      this.setState({ title: title })
    }
  }

  /**
   * Set state for the single control width, sum width of all controls
   */
  setControlData () {
    const controls = Array.prototype.slice.call(this.elementsContainer.children)
    const controlStyle = window.getComputedStyle(controls[0])
    const controlWidth = parseInt(controlStyle.width)
    const controlMargin = parseInt(controlStyle.marginLeft) + parseInt(controlStyle.marginRight)
    const controlFullWidth = controlWidth + controlMargin
    this.setState({
      controlWidth: controlFullWidth,
      controlsWidth: controlFullWidth * this.state.templates.length + 1
    })
  }

  getLayoutControls () {
    const layouts = []
    const inactiveIcons = Object.assign({}, LayoutIcons)
    const customLayout = pageLayouts.find(item => item.type === 'vc-custom-layout')

    delete inactiveIcons['vc-custom-layout']
    if (customLayout) {
      const Icon = LayoutIcons[customLayout.type] && LayoutIcons[customLayout.type].icon.default
      let active = false
      if (this.state.current.type === customLayout.type) {
        active = true
      }
      layouts.push(
        <TemplatePreview
          key='custom-layout-icon-start-blank'
          onClick={this.handleLayoutClick}
          templatesList={customLayout}
          templateValue='default'
          templateName={customLayout.type}
          icon={Icon}
          active={active}
          name={customLayout.title}
        />
      )
    }

    if (pageLayouts) {
      const allowedTypes = ['vc', 'vc-theme']
      pageLayouts.forEach((templatesList, key) => {
        if (allowedTypes.indexOf(templatesList.type) >= 0) {
          templatesList.values.forEach((template, index) => {
            const templateName = `${templatesList.type}__${template.value}`
            const Icon = LayoutIcons[templateName] && LayoutIcons[templateName].icon.default
            delete inactiveIcons[templateName]
            let active = false
            if (this.state.current.type === templatesList.type && this.state.current.value === template.value) {
              active = true
            }
            layouts.push(
              <TemplatePreview
                key={`layout-${key}-${index}`}
                onClick={this.handleLayoutClick}
                templatesList={templatesList}
                templateValue={template.value}
                templateName={templateName}
                icon={Icon}
                active={active}
                name={template.label}
              />
            )
          })
        }
      })
    }

    // get inactive controls
    for (const templateName of Object.keys(inactiveIcons)) {
      const allowedTypes = ['vc', 'vc-theme']
      let allowed = false

      allowedTypes.forEach((allowedType) => {
        if (templateName.indexOf(allowedType) >= 0) {
          allowed = true
        }
      })

      if (allowed) {
        layouts.push(
          <TemplatePreview
            key={`layout-inactive-${templateName}`}
            templateName={templateName}
            icon={inactiveIcons[templateName].icon.default}
            name={inactiveIcons[templateName].label}
            disabled={allowed}
          />
        )
      }
    }

    const Icon = LayoutIcons['theme-default'] && LayoutIcons['theme-default'].icon.default
    let active = false
    if (this.state.current.type === 'theme') {
      active = true
    }
    layouts.push(
      <TemplatePreview
        key='layout-theme-default'
        onClick={this.handleLayoutClick}
        icon={Icon}
        blank
        name='Theme'
        templateName='theme-default'
        active={active}
      />
    )
    return layouts
  }

  getPermalink () {
    const editorType = dataManager.get('editorType')
    if (editorType === 'default') {
      return <Permalink />
    }
    return null
  }

  handleLayoutClick (layoutType, layoutValue) {
    settingsStorage.state('skipBlank').set(true)
    const activeLayout = settingsStorage.state('pageTemplate').get() || { type: 'vc', value: 'blank' }
    const newLayout = {
      type: layoutType,
      value: layoutValue,
      stretchedContent: false
    }
    if (activeLayout.value !== newLayout.value) {
      settingsStorage.state('pageTemplate').set(newLayout)
      workspaceIFrame.set({ type: 'reload', template: newLayout })
    }
    this.updateState(newLayout)
  }

  /**
   * Set state for the width of element controls container
   */
  setControlsLayout () {
    const { controlWidth, controlsWidth } = this.state
    const containerWidth = this.rowContainer.getBoundingClientRect().width
    const elementsCount = Math.floor(containerWidth / controlWidth)
    let elementsWidth = elementsCount * controlWidth
    elementsWidth = elementsWidth < controlsWidth ? elementsWidth : null
    if (this.state.containerWidth !== elementsWidth) {
      this.setState({ containerWidth: elementsWidth })
    }
  }

  handleAddElementClick (e) {
    e && e.preventDefault()
    workspaceStorage.state('settings').set({
      action: 'add',
      element: {},
      tag: '',
      options: {}
    })
  }

  handleAddTemplateClick (e) {
    e && e.preventDefault()
    workspaceStorage.state('settings').set({
      action: 'addTemplate',
      element: {},
      tag: '',
      options: {}
    })
  }

  handleTitleChange (e) {
    this.setState({ title: e.currentTarget.value })
    settingsStorage.state('pageTitle').set(e.currentTarget.value)
  }

  render () {
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const addTemplatText = localizations ? localizations.addTemplate : 'Add Template'
    const descriptionText = localizations ? localizations.blankPageHelperText : 'Start by adding an element to your layout or select one of the pre-defined templates.'
    const placeholderText = localizations ? localizations.blankPageInputPlaceholderText : 'Page title'
    const containerWidth = {}
    if (this.state && this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }
    let startBlankControlsClasses = 'vcv-start-blank-controls'
    startBlankControlsClasses += ' vcv-start-blank-controls-layout'

    return (
      <div className={startBlankControlsClasses}>
        <div
          className='vcv-start-blank-item-list-container'
          ref={(container) => { this.rowContainer = container }}
        >
          <div className='vcv-start-blank-title-input-container'>
            <input className='vcv-start-blank-title-input' type='text' placeholder={placeholderText} value={this.state.title} onChange={this.handleTitleChange} />
          </div>
          {this.getPermalink()}
          <ul
            className='vcv-ui-item-list vcv-start-blank-item-list'
            style={containerWidth}
            ref={(container) => { this.elementsContainer = container }}
          >
            {this.getLayoutControls()}
          </ul>
        </div>
        <div className='vcv-start-blank-description'>{descriptionText}</div>
        <div className='vcv-start-blank-button-container'>
          <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleAddElementClick}>{addElementText}</button>
          <button className='vcv-ui-form-button vcv-ui-form-button--large' onClick={this.handleAddTemplateClick}>{addTemplatText}</button>
        </div>
      </div>
    )
  }
}
