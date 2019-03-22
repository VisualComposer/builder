import React from 'react'
import vcCake from 'vc-cake'
import TemplatePreview from './templatePreview'
import LayoutIcons from './layoutIcons/index'

const templateManager = vcCake.getService('myTemplates')
const settingsStorage = vcCake.getStorage('settings')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

let pageLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()

export default class PagePanelContent extends React.Component {
  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null

  constructor (props) {
    super(props)

    let currentTemplate = settingsStorage.state('pageTemplate').get() || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
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
    this.addResizeListener(this.rowContainer, this.setControlsLayout)
    settingsStorage.state('pageTemplate').onChange(this.updateState)
    settingsStorage.state('pageTitle').onChange(this.updatePageTitle)
  }

  componentWillUnmount () {
    this.removeResizeListener(this.rowContainer, this.setControlsLayout)
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
    title && this.setState({ title: title })
  }

  /**
   * Add element resize listener
   * @param element
   * @param fn
   */
  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this.contentDocument.defaultView.addEventListener('resize', fn)
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

  /**
   * Remove element resize listener
   * @param element
   * @param fn
   */
  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  /**
   * Set state for the single control width, sum width of all controls
   */
  setControlData () {
    const controls = Array.prototype.slice.call(this.elementsContainer.children)
    const controlStyle = window.getComputedStyle(controls[ 0 ])
    const controlWidth = parseInt(controlStyle.width)
    const controlMargin = parseInt(controlStyle.marginLeft) + parseInt(controlStyle.marginRight)
    const controlFullWidth = controlWidth + controlMargin
    this.setState({
      controlWidth: controlFullWidth,
      controlsWidth: controlFullWidth * this.state.templates.length + 1
    })
  }

  getLayoutControls () {
    let layouts = []
    let inactiveIcons = Object.assign({}, LayoutIcons)

    if (pageLayouts) {
      let allowedTypes = [ 'vc', 'vc-theme' ]
      pageLayouts.forEach((templatesList, key) => {
        if (allowedTypes.indexOf(templatesList.type) >= 0) {
          templatesList.values.forEach((template, index) => {
            let templateName = `${templatesList.type}__${template.value}`
            let Icon = LayoutIcons[ templateName ] && LayoutIcons[ templateName ].icon.default
            delete inactiveIcons[ templateName ]
            let active = false
            if (this.state.current.type === templatesList.type && this.state.current.value === template.value) {
              active = true
            }
            layouts.push(
              <TemplatePreview key={`layout-${key}-${index}`}
                click={this.handleLayoutClick}
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
      let allowedTypes = [ 'vc', 'vc-theme' ]
      let allowed = false

      allowedTypes.forEach((allowedType) => {
        if (templateName.indexOf(allowedType) >= 0) {
          allowed = true
        }
      })

      if (allowed) {
        layouts.push(
          <TemplatePreview key={`layout-inactive-${templateName}`}
            templateName={templateName}
            icon={inactiveIcons[ templateName ].icon.default}
            name={inactiveIcons[ templateName ].label}
            disabled={allowed}
          />
        )
      }
    }

    let Icon = LayoutIcons[ 'theme-default' ] && LayoutIcons[ 'theme-default' ].icon.default
    let active = false
    if (this.state.current.type === 'theme') {
      active = true
    }
    layouts.push(
      <TemplatePreview key={`layout-theme-default`}
        click={this.handleLayoutClick}
        icon={Icon}
        blank
        name={'Theme default'}
        templateName={'theme-default'}
        active={active}
      />
    )
    return layouts
  }

  handleLayoutClick (layoutType, layoutValue) {
    settingsStorage.state('skipBlank').set(true)
    let activeLayout = settingsStorage.state('pageTemplate').get() || { type: 'vc', value: 'blank' }
    let newLayout = {
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
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const addTemplatText = localizations ? localizations.addTemplate : 'Add Template'
    const descriptionText = localizations ? localizations.blankPageHelperText : 'Start by adding an element to your layout or select one of the pre-defined templates.'
    const placeholderText = localizations ? localizations.blankPageInputPlaceholderText : 'Page title'
    let containerWidth = {}
    if (this.state && this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }
    let startBlankControlsClasses = 'vcv-start-blank-controls'
    startBlankControlsClasses += ' vcv-start-blank-controls-layout'

    return <div className={startBlankControlsClasses}>
      <div
        className='vcv-start-blank-item-list-container'
        ref={(container) => { this.rowContainer = container }}
      >
        <div className='vcv-start-blank-title-input-container'>
          <input className='vcv-start-blank-title-input' type='text' placeholder={placeholderText} value={this.state.title} onChange={this.handleTitleChange} />
        </div>
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
        <button className='vcv-start-blank-button' onClick={this.handleAddElementClick}>{addElementText}</button>
        <button className='vcv-start-blank-button' onClick={this.handleAddTemplateClick}>{addTemplatText}</button>
      </div>
    </div>
  }
}
