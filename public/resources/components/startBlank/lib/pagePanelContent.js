import React from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'
import TemplatePreview from './templatePreview'
import LayoutIcons from './layoutIcons'

const templateManager = vcCake.getService('myTemplates')
const settingsStorage = vcCake.getStorage('settings')
const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

let pageLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()

export default class PagePanelContent extends React.Component {
  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null

  static propTypes = {
    unmountStartBlank: PropTypes.func.isRequired,
    handleCloseClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      templates: templateManager.predefined()
    }

    let currentTemplate = settingsStorage.state('pageTemplate').get() || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
    if (currentTemplate && currentTemplate.type && currentTemplate.value) {
      settingsStorage.state('pageTemplate').set(currentTemplate)
    }

    this.currentLayout = currentTemplate || { type: 'theme', value: 'default' }

    this.handleControlClick = this.handleControlClick.bind(this)
    this.handleLayoutClick = this.handleLayoutClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
  }

  componentDidMount () {
    this.setControlData()
    // set timeout to get new state data from setControlData()
    this.initialSetControlsLayoutTimeout = setTimeout(() => {
      this.setControlsLayout()
    }, 1)
    this.addResizeListener(this.rowContainer, this.setControlsLayout)
  }

  componentWillUnmount () {
    this.removeResizeListener(this.rowContainer, this.setControlsLayout)
    if (this.initialSetControlsLayoutTimeout) {
      window.clearTimeout(this.initialSetControlsLayoutTimeout)
      this.initialSetControlsLayoutTimeout = null
    }
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

  handleControlClick (props) {
    const { blank, data } = props
    if (!blank) {
      elementsStorage.trigger('merge', data)
    }
    this.props.handleCloseClick(blank)
  }

  getTemplateControlProps (template) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const blankText = localizations ? localizations.blankPage : 'Blank Page'

    if (template !== 'blank') {
      return {
        key: 'vcv-element-control-' + template.id,
        addClick: this.handleControlClick,
        ...template
      }
    } else {
      return {
        key: 'vcv-element-control-blank',
        addClick: this.handleControlClick,
        name: blankText,
        blank: true
      }
    }
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
            layouts.push(
              <TemplatePreview key={`layout-${key}-${index}`}
                click={this.handleLayoutClick}
                templatesList={templatesList}
                templateValue={template.value}
                templateName={templateName}
                icon={Icon}
                name={template.label}
              />
            )
          })
        }
      })
    }

    if (vcCake.env('FT_SHOW_ALL_LAYOUTS')) {
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
    }

    let Icon = LayoutIcons[ 'theme-default' ] && LayoutIcons[ 'theme-default' ].icon.default
    layouts.push(
      <TemplatePreview key={`layout-theme-default`}
        click={this.handleLayoutClick}
        icon={Icon}
        blank
        name={'Theme default'}
        templateName={'theme-default'}
      />
    )
    return layouts
  }

  handleLayoutClick (layoutType, layoutValue) {
    settingsStorage.state('skipBlank').set(true)
    let activeLayout = settingsStorage.state('pageTemplate').get() || { type: 'theme', value: 'default' }
    let newLayout = {
      type: layoutType,
      value: layoutValue
    }
    if (activeLayout.value !== newLayout.value) {
      settingsStorage.state('pageTemplate').set(newLayout)
      workspaceIFrame.set({ type: 'reload', template: newLayout })
    }

    this.props.unmountStartBlank()
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

  render () {
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
        <ul
          className='vcv-ui-item-list vcv-start-blank-item-list'
          style={containerWidth}
          ref={(container) => { this.elementsContainer = container }}
        >
          {this.getLayoutControls()}
        </ul>
      </div>
      <div className='vcv-start-blank-description'>You can change layout of your page later on at any time via Visual Composer Settings</div>
    </div>
  }
}
