import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Field from './field'
import EditFormSettings from './editFormSettings'
import { env, getService, getStorage } from 'vc-cake'
import Tooltip from '../../../tooltip/tooltip'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')
const documentService = getService('document')
const myTemplatesService = getService('myTemplates')
const hubElementsStorage = getStorage('hubElements')
const cook = getService('cook')

export default class EditFormSection extends React.Component {
  _isMounted = false

  static propTypes = {
    tab: PropTypes.object.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
    isRootElement: PropTypes.bool,
    accordion: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    activeSectionIndex: PropTypes.number
  }

  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)
    this.state = {
      isActive: !this.props.accordion,
      dependenciesClasses: [],
      name: '',
      error: false,
      errorName: '',
      showSpinner: false,
      isInnerElementReplaceOpened: false
    }

    this.handleClickToggleSection = this.handleClickToggleSection.bind(this)
    this.handleToggleShowReplace = this.handleToggleShowReplace.bind(this)
    this.onSettingsSave = this.onSettingsSave.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.displayError = this.displayError.bind(this)
    this.displaySuccess = this.displaySuccess.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onSaveFailed = this.onSaveFailed.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
    if (this.props.tab.index === this.props.activeTabIndex || this.props.tab.index === this.props.activeSectionIndex) {
      window.setTimeout(() => {
        this.checkSectionPosition()
      }, 0)
    }

    if (this.props.setFieldMount) {
      this.props.setFieldMount(this.props.tab.fieldKey, {
        refWrapperComponent: this,
        refWrapper: this.section
      }, 'section')
    }
  }

  componentDidUpdate (prevProps, prevState) {
    window.setTimeout(() => {
      this.checkSectionPosition(prevState)
    }, 0)
  }

  componentWillUnmount () {
    this._isMounted = false
    if (this.props.setFieldUnmount) {
      this.props.setFieldUnmount(this.props.tab.fieldKey, 'section')
    }
  }

  /**
   * Set workspace storage state to scroll edit form if section content is below the fold
   */
  checkSectionPosition (prevState) {
    if (!this.sectionHeader) {
      return
    }
    const { isActive } = this.state
    if ((prevState && !prevState.isActive && isActive) || (this.props.sectionIndex === this.props.activeSectionIndex)) {
      // will scroll to top
      const scrollbar = this.props.getSectionContentScrollbar()
      if (scrollbar) {
        const headerRect = this.sectionHeader.getBoundingClientRect()
        const headerOffset = this.sectionHeader.offsetTop + headerRect.height
        const offset = headerOffset - headerRect.height
        scrollbar.scrollTop(offset)
      }
    }
  }

  /**
   * Toggle section
   */
  handleClickToggleSection (e) {
    if (e.currentTarget === e.target || (e.target && e.target.classList && e.target.classList.contains('vcv-ui-edit-form-section-header-title'))) {
      this.setState({ isActive: !this.state.isActive })
    }
  }

  /**
   * Get section form fields
   * @param tabParams
   * @return Array
   */
  getSectionFormFields (tabParams) {
    return tabParams.map((param) => {
      let fieldType = param.data && param.data.type ? param.data.type.name : ''
      if (this.props.options.nestedAttr) {
        fieldType = typeof param.data.type === 'string' ? param.data.type : param.data.type.name || ''
      }
      const fieldOptions = this.checkContainerDependency(param)
      if (fieldOptions && fieldOptions.hide) {
        return null
      }

      const removeDependencies = fieldOptions && fieldOptions.removeDependencies

      if (this.props?.options?.child) {
        const element = documentService.get(this.props.elementAccessPoint.id)
        if (element?.exclude?.indexOf(param.key) >= 0) {
          return
        }
      }

      return (
        <Field
          {...this.props}
          key={`edit-form-field-${param.key}`}
          fieldKey={param.key}
          fieldType={fieldType}
          removeDependencies={removeDependencies}
          isInnerElementReplaceOpened={this.state.isInnerElementReplaceOpened}
        />
      )
    })
  }

  checkContainerDependency (param) {
    const options = param.data && param.data.settings && param.data.settings.options
    const containerDependency = options && options.containerDependency
    const opts = {}

    if (containerDependency) {
      const editorType = dataManager.get('editorType')

      Object.keys(containerDependency).forEach((key) => {
        const action = containerDependency[key]
        if (editorType === key) {
          opts[action] = true
        }
      })
    }

    return opts
  }

  onSettingsSave (e) {
    e.preventDefault()

    if (this.props.isRootElement) {
      this.saveAsBlock()
    } else {
      this.saveAsPreset()
    }
  }

  saveAsBlock () {
    const templateAlreadyExistsText = EditFormSection.localizations.blockAlreadyExists || 'A block with this name already exists. Choose a different block name.'
    const templateSaveFailedText = EditFormSection.localizations.blockSaveFailed || 'Failed to save the block.'
    const specifyTemplateNameText = EditFormSection.localizations.specifyBlockName || 'Enter the block name to save this Row as a block template.'

    let { name } = this.state
    name = name.trim()
    if (name) {
      if (myTemplatesService.findBy('name', name)) {
        this.displayError(templateAlreadyExistsText)
      } else {
        this.setState({ showSpinner: name })
        const templateAddResult = myTemplatesService.addElementTemplate(this.props.elementId, name, this.onSaveSuccess, this.onSaveFailed, 'customBlock')
        if (!templateAddResult) {
          this.displayError(templateSaveFailedText)
        }
      }
    } else {
      this.displayError(specifyTemplateNameText)
    }
  }

  saveAsPreset () {
    const couldNotParseData = EditFormSection.localizations ? EditFormSection.localizations.couldNotParseData : 'Could not parse data from the server.'
    const elementHasBeenSaved = EditFormSection.localizations ? EditFormSection.localizations.elementHasBeenSaved : 'The element has been successfully saved.'
    const noAccessCheckLicence = EditFormSection.localizations ? EditFormSection.localizations.noAccessCheckLicence : 'No access, check your license.'
    const elementNameAlreadyExists = EditFormSection.localizations ? EditFormSection.localizations.elementNameAlreadyExists : 'The element with such a name already exists!'
    const enterPresetNameToSave = EditFormSection.localizations ? EditFormSection.localizations.enterPresetNameToSave : 'Enter a preset name to save the element as a preset!'

    if (!this.state.name) {
      this.displayError(enterPresetNameToSave)
      return
    }
    const existingPresets = hubElementsStorage.state('elementPresets').get()
    const filterPreset = existingPresets.filter(item => item.name === this.state.name)
    if (filterPreset.length) {
      this.displayError(elementNameAlreadyExists)
      return
    }
    const elementData = documentService.get(this.props.elementId)
    const cookElement = cook.get(elementData)
    // Filter only public attributes
    const publicAttributes = cookElement.filter((key, value, settings) => {
      return settings.access === 'public'
    })
    const elementPublicData = {}
    publicAttributes.forEach((key) => {
      elementPublicData[key] = elementData[key]
    })

    // Remove custom ID
    delete elementPublicData.metaCustomId
    // Add tag
    elementPublicData.tag = elementData.tag
    elementPublicData.customHeaderTitle = cookElement.getName()

    this.setState({ showSpinner: this.state.name })

    dataProcessor.appServerRequest({
      'vcv-action': 'addon:presets:save:adminNonce',
      'vcv-preset-title': this.state.name,
      'vcv-preset-tag': `${elementData.tag}-preset-${this.state.name.replace(/ /g, '')}`,
      'vcv-preset-value': window.encodeURIComponent(JSON.stringify(elementPublicData)),
      'vcv-nonce': dataManager.get('nonce')
    }).then((data) => {
      try {
        const jsonData = JSON.parse(data)
        if (jsonData && jsonData.status && jsonData.data) {
          jsonData.data.presetData = JSON.parse(window.decodeURIComponent(jsonData.data.presetData))
          hubElementsStorage.trigger('addPreset', jsonData.data)
          if (this._isMounted) {
            this.displaySuccess(elementHasBeenSaved)
          }
        } else {
          let errorMessage = jsonData.response && jsonData.response.message ? jsonData.response.message : jsonData.message
          errorMessage = errorMessage || noAccessCheckLicence
          if (this._isMounted) {
            this.displayError(errorMessage)
          }

          if (env('VCV_DEBUG')) {
            console.warn(errorMessage, jsonData)
          }
        }
      } catch (e) {
        if (this._isMounted) {
          this.displayError(couldNotParseData)
        }

        if (env('VCV_DEBUG')) {
          console.warn(couldNotParseData, e)
        }
      }
    })
  }

  onSaveSuccess () {
    const blockSaved = EditFormSection.localizations.blockSaved || 'The block has been successfully saved.'
    this.displaySuccess(blockSaved)
  }

  onSaveFailed () {
    const errorText = EditFormSection.localizations.blockSaveFailed || 'Failed to save the block.'
    this.displayError(errorText)
  }

  onNameChange (e) {
    this.setState({
      name: e.currentTarget.value,
      error: false
    })
  }

  displaySuccess (successText) {
    this.setState({ showSpinner: false, name: '' })
    store.dispatch(notificationAdded({
      text: successText,
      time: 5000
    }))
  }

  displayError (errorText) {
    this.setState({ showSpinner: false })
    store.dispatch(notificationAdded({
      type: 'error',
      text: errorText,
      time: 5000
    }))
  }

  handleToggleShowReplace () {
    this.setState({
      isInnerElementReplaceOpened: !this.state.isInnerElementReplaceOpened
    })
  }

  render () {
    const { tab, isEditFormSettings, isRootElement, accordion } = this.props
    const { isActive, dependenciesClasses, isInnerElementReplaceOpened } = this.state
    const sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive,
      'vcv-ui-edit-form-section--single': !accordion
    }, dependenciesClasses)

    let tabTitle
    try {
      if (this.props.options && this.props.options.nestedAttr) {
        tabTitle = tab?.data?.options ? tab.data.options.label || tab.data.options.tabLabel : tab.data.settings.options.label || tab.data.settings.options.tabLabel
      } else {
        tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel
      }
    } catch (e) {
      console.error(`The "${tab.fieldKey}" tab property is missing in settings.json file.`, e)
    }

    let showReplaceIcon = false
    let backButton = null
    let innerElementReplaceIcon = null

    if (this.props.options && this.props.options.nestedAttr) {
      if (tab.data.type === 'element' && !tab.data.options.disableReplaceable && tab.data.options.replaceView !== 'dropdown') {
        const category = tab.data.options.category || '*'
        showReplaceIcon = this.props.getReplaceShownStatus(category)
      }
    } else {
      if (tab.data.settings.type === 'element' && !tab.data.settings.options.disableReplaceable && tab.data.settings.options.replaceView !== 'dropdown') {
        const category = tab.data.settings.options.category || '*'
        showReplaceIcon = this.props.getReplaceShownStatus(category)
      }
    }

    if (showReplaceIcon) {
      const backToParentTitle = EditFormSection.localizations ? EditFormSection.localizations.backToParent : 'Back to parent'

      if (isInnerElementReplaceOpened) {
        backButton = (
          <span className='vcv-ui-edit-form-section-header-go-back' onClick={this.handleToggleShowReplace} title={backToParentTitle}>
            <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
          </span>
        )
      }

      innerElementReplaceIcon = <span className='vcv-ui-edit-form-section-header-control vcv-ui-icon vcv-ui-icon-swap' onClick={this.handleToggleShowReplace} />
    }

    let tooltipText = null
    let tooltip = null
    try {
      if (this.props.options && this.props.options.nestedAttr) {
        tooltipText = tab?.data?.options ? tab.data.options.tooltip : tab.data.settings.options.tooltip
      } else {
        tooltipText = tab.data.settings.options.tooltip
      }
    } catch (e) {
      console.error(`The "${tab.fieldKey}" tab property is missing in settings.json file.`, e)
    }
    if (tooltipText) {
      tooltip = (
        <Tooltip>
          {tooltipText}
        </Tooltip>
      )
    }

    let sectionHeader = null
    if (accordion) {
      sectionHeader = !isEditFormSettings && (
        <div
          className='vcv-ui-edit-form-section-header' onClick={this.handleClickToggleSection}
          ref={header => { this.sectionHeader = header }}
        >
          {backButton}
          <span className='vcv-ui-edit-form-section-header-title'>{tabTitle}</span>
          {tooltip}
          {innerElementReplaceIcon}
          <i className='vcv-ui-icon vcv-ui-icon-chevron-thick' />
        </div>
      )
    }
    return (
      <div className={sectionClasses} key={tab.key} ref={ref => { this.section = ref }}>
        {sectionHeader}
        <form className='vcv-ui-edit-form-section-content' onSubmit={isEditFormSettings && this.onSettingsSave}>
          {isEditFormSettings ? (
            <EditFormSettings
              isRootElement={isRootElement}
              handleNameChange={this.onNameChange}
              nameValue={this.state.name}
              showSpinner={this.state.showSpinner}
              tabTitle={tabTitle}
            />
          ) : (
            <>
              {this.getSectionFormFields(tab.params)}
            </>
          )}
        </form>
      </div>
    )
  }
}
