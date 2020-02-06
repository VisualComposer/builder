import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Field from './field'
import EditFormReplaceElement from './editFormReplaceElement'
import EditFormSettings from './editFormSettings'
import { env, getService, getStorage } from 'vc-cake'

const dataProcessor = getService('dataProcessor')
const documentService = getService('document')
const myTemplatesService = getService('myTemplates')
const notificationsStorage = getStorage('notifications')
const hubElementsStorage = getStorage('hubElements')
const cook = getService('cook')

export default class EditFormSection extends React.Component {
  static propTypes = {
    tab: PropTypes.object.isRequired,
    onAttributeChange: PropTypes.func.isRequired,
    isRootElement: PropTypes.bool
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  constructor (props) {
    super(props)
    this.state = {
      isActive: true,
      dependenciesClasses: [],
      name: '',
      error: false,
      errorName: '',
      showSpinner: false
    }

    this.handleClickToggleSection = this.handleClickToggleSection.bind(this)
    this.onSettingsSave = this.onSettingsSave.bind(this)
    this.onNameChange = this.onNameChange.bind(this)
    this.displayError = this.displayError.bind(this)
    this.displaySuccess = this.displaySuccess.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onSaveFailed = this.onSaveFailed.bind(this)
  }

  componentDidMount () {
    if (this.props.tab.index === this.props.activeTabIndex) {
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

    if (this.props.isEditFormSettings) {
      notificationsStorage.trigger('portalChange', '.vcv-ui-tree-content-section')
    }
  }

  componentDidUpdate (prevProps, prevState) {
    window.setTimeout(() => {
      this.checkSectionPosition(prevState)
    }, 0)
  }

  componentWillUnmount () {
    if (this.props.setFieldUnmount) {
      this.props.setFieldUnmount(this.props.tab.fieldKey, 'section')
    }
    if (this.props.isEditFormSettings) {
      notificationsStorage.trigger('portalChange', null)
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
    if ((prevState && !prevState.isActive && isActive) || this.props.tab.index === this.props.activeTabIndex) {
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
  handleClickToggleSection () {
    this.setState({ isActive: !this.state.isActive })
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
        fieldType = param.data.type
      }
      const fieldOptions = this.checkContainerDependency(param)
      if (fieldOptions && fieldOptions.hide) {
        return null
      }
      const removeDependencies = fieldOptions && fieldOptions.removeDependencies

      return (
        <Field
          {...this.props}
          key={`edit-form-field-${param.key}`}
          fieldKey={param.key}
          fieldType={fieldType}
          removeDependencies={removeDependencies}
        />
      )
    })
  }

  checkContainerDependency (param) {
    const options = param.data && param.data.settings && param.data.settings.options
    const containerDependency = options && options.containerDependency
    const opts = {}

    if (containerDependency) {
      const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'

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
      this.saveAsTemplate()
    } else {
      this.saveAsPreset()
    }
  }

  saveAsTemplate () {
    const templateAlreadyExistsText = EditFormSection.localizations ? EditFormSection.localizations.templateAlreadyExists : 'Template with this name already exist. Please specify another name.'
    const templateSaveFailedText = EditFormSection.localizations ? EditFormSection.localizations.templateSaveFailed : 'Template save failed'
    const specifyTemplateNameText = EditFormSection.localizations ? EditFormSection.localizations.specifyTemplateName : 'Enter template name to save your page as a template'

    let { name } = this.state
    name = name.trim()
    if (name) {
      if (myTemplatesService.findBy('name', name)) {
        this.displayError(templateAlreadyExistsText)
      } else {
        this.setState({ showSpinner: name })
        const templateAddResult = myTemplatesService.addElementTemplate(this.props.elementId, name, this.onSaveSuccess, this.onSaveFailed)
        if (!templateAddResult) {
          this.displayError(templateSaveFailedText)
        }
      }
    } else {
      this.displayError(specifyTemplateNameText)
    }
  }

  saveAsPreset () {
    const couldNotParseData = EditFormSection.localizations ? EditFormSection.localizations.couldNotParseData : 'Could not parse data from server!'
    const elementHasBeenSaved = EditFormSection.localizations ? EditFormSection.localizations.elementHasBeenSaved : 'The element has been successfully saved.'
    const noAccessCheckLicence = EditFormSection.localizations ? EditFormSection.localizations.noAccessCheckLicence : 'No access, please check your license!'
    const elementNameAlreadyExists = EditFormSection.localizations ? EditFormSection.localizations.elementNameAlreadyExists : 'The element with such name already exists!'
    const enterPresetNameToSave = EditFormSection.localizations ? EditFormSection.localizations.enterPresetNameToSave : 'Enter preset name to save your element as a preset!'

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

    this.setState({ showSpinner: this.state.name })

    dataProcessor.appServerRequest({
      'vcv-action': 'addon:presets:save:adminNonce',
      'vcv-preset-title': this.state.name,
      'vcv-preset-tag': `${elementData.tag}-preset-${this.state.name.replace(/ /g, '')}`,
      'vcv-preset-value': JSON.stringify(elementPublicData),
      'vcv-nonce': window.vcvNonce
    }).then((data) => {
      try {
        const jsonData = JSON.parse(data)
        if (jsonData && jsonData.status && jsonData.data) {
          jsonData.data.presetData = JSON.parse(jsonData.data.presetData)
          hubElementsStorage.trigger('addPreset', jsonData.data)
          this.displaySuccess(elementHasBeenSaved)
        } else {
          let errorMessage = jsonData.response ? jsonData.response.message : jsonData.message
          errorMessage = errorMessage || noAccessCheckLicence
          this.displayError(errorMessage)

          if (env('VCV_DEBUG')) {
            console.warn(errorMessage, jsonData)
          }
        }
      } catch (e) {
        this.displayError(couldNotParseData)

        if (env('VCV_DEBUG')) {
          console.warn(couldNotParseData, e)
        }
      }
    })
  }

  onSaveSuccess () {
    this.setState({
      name: ''
    })
    const templateSaved = EditFormSection.localizations ? EditFormSection.localizations.templateSaved : 'The template has been successfully saved.'
    this.displaySuccess(templateSaved)
  }

  onSaveFailed () {
    const errorText = EditFormSection.localizations ? EditFormSection.localizations.templateSaveFailed : 'Template save failed'
    this.displayError(errorText)
  }

  onNameChange (e) {
    this.setState({
      name: e.currentTarget.value,
      error: false
    })
  }

  displaySuccess (successText) {
    this.setState({ showSpinner: false })
    notificationsStorage.trigger('add', {
      position: 'bottom',
      text: successText,
      time: 3000
    })
  }

  displayError (errorText) {
    this.setState({ showSpinner: false })
    notificationsStorage.trigger('add', {
      position: 'bottom',
      type: 'error',
      text: errorText,
      time: 3000
    })
  }

  render () {
    const { tab, sectionIndex, isEditFormSettings, isRootElement } = this.props
    const { isActive, dependenciesClasses } = this.state
    const sectionClasses = classNames({
      'vcv-ui-edit-form-section': true,
      'vcv-ui-edit-form-section--opened': isActive,
      'vcv-ui-edit-form-section--closed': !isActive
    }, dependenciesClasses)

    let tabTitle
    if (this.props.options && this.props.options.nestedAttr) {
      tabTitle = tab.data.options.label || tab.data.options.tabLabel
    } else {
      tabTitle = tab.data.settings.options.label ? tab.data.settings.options.label : tab.data.settings.options.tabLabel
    }
    let replaceElement = null

    if (sectionIndex === 0) {
      let disableReplaceable = false
      if (this.props.options && this.props.options.nestedAttr) {
        disableReplaceable = tab.data.options.disableReplaceable
      } else {
        disableReplaceable = tab.data.settings.options.disableReplaceable
      }

      if (!disableReplaceable) {
        replaceElement = (
          <EditFormReplaceElement {...this.props} />
        )
      }
    }

    return (
      <div className={sectionClasses} key={tab.key} ref={ref => { this.section = ref }}>
        <div
          className='vcv-ui-edit-form-section-header' onClick={this.handleClickToggleSection}
          ref={header => { this.sectionHeader = header }}
        >
          {tabTitle}
        </div>
        <form className='vcv-ui-edit-form-section-content' onSubmit={isEditFormSettings && this.onSettingsSave}>
          {isEditFormSettings ? (
            <EditFormSettings
              isRootElement={isRootElement}
              handleNameChange={this.onNameChange}
              nameValue={this.state.name}
              showSpinner={this.state.showSpinner}
            />
          ) : (
            <>
              {replaceElement}
              {this.getSectionFormFields(tab.params)}
            </>
          )}
        </form>
      </div>
    )
  }
}
