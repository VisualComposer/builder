import React from 'react'
import classNames from 'classnames'
import { getService, getStorage, env } from 'vc-cake'
import PropTypes from 'prop-types'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'
import { fullScreenPopupDataSet, activeFullPopupSet } from 'public/editor/stores/editorPopup/slice'

const dataManager = getService('dataManager')
const hubElementsService = getService('hubElements')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const workspaceSettings = workspaceStorage.state('settings')
const documentManager = getService('document')
const hubStorage = getStorage('hubAddons')
const hubAddonsStorage = getStorage('hubAddons')
const roleManager = getService('roleManager')
const elementAccessPointService = getService('elementAccessPoint')

export default class EditFormHeader extends React.Component {
  static propTypes = {
    elementAccessPoint: PropTypes.object.isRequired,
    options: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      content: props.elementAccessPoint.cook().getName(),
      editable: false,
      isDropdownActive: false,
      isPresetActive: false,
      hidden: props.elementAccessPoint.cook().get('hidden'),
      isLocked: props.elementAccessPoint.cook().get('metaIsElementLocked')
    }

    this.handleClickEnableEditable = this.handleClickEnableEditable.bind(this)
    this.handleBlurValidateContent = this.handleBlurValidateContent.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.updateElementOnChange = this.updateElementOnChange.bind(this)
    this.handleClickGoBack = this.handleClickGoBack.bind(this)
    this.handleClickHide = this.handleClickHide.bind(this)
    this.updateHiddenState = this.updateHiddenState.bind(this)
    this.updateLockState = this.updateLockState.bind(this)
    this.handleLockElementToggle = this.handleLockElementToggle.bind(this)
    this.handleToggleDropdown = this.handleToggleDropdown.bind(this)
    this.handleRemoveElement = this.handleRemoveElement.bind(this)
    this.handleSaveAsPreset = this.handleSaveAsPreset.bind(this)
    this.handleOutsideClick = this.handleOutsideClick.bind(this)
  }

  componentDidMount () {
    const { elementAccessPoint } = this.props
    elementAccessPoint.onChange(this.updateElementOnChange)
    workspaceStorage.on('hide', this.updateHiddenState)
    workspaceStorage.on('lock', this.updateLockState)
  }

  componentWillUnmount () {
    const { elementAccessPoint } = this.props
    elementAccessPoint.ignoreChange(this.updateElementOnChange)
    workspaceStorage.off('hide', this.updateHiddenState)
    workspaceStorage.off('lock', this.updateLockState)
  }

  updateHiddenState (id) {
    const { elementAccessPoint } = this.props
    if (id === elementAccessPoint.id) {
      const newHiddenState = documentManager.get(elementAccessPoint.id).hidden
      this.setState({ hidden: newHiddenState })
    }
  }

  updateLockState (id) {
    const { elementAccessPoint } = this.props
    if (id === elementAccessPoint.id) {
      const newLockState = documentManager.get(elementAccessPoint.id).metaIsElementLocked
      this.setState({ isLocked: newLockState })
    }
  }

  updateElementOnChange () {
    const { elementAccessPoint } = this.props
    const cookElement = elementAccessPoint.cook()
    const content = cookElement.getName()
    // Check element name field
    if (this.state.content !== content) {
      this.setState({
        content
      }, () => {
        this.span.innerText = content
      })
    }

    // Trigger attributes events
    const publicKeys = cookElement.filter((key, value, settings) => {
      return settings.access === 'public'
    })
    publicKeys.forEach((key) => {
      const newValue = cookElement.get(key)
      elementsStorage.trigger(`element:${cookElement.get('id')}:attribute:${key}`, newValue, cookElement)
    })
  }

  handleClickEnableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span.focus()
    })
  }

  editTitle () {
    this.handleClickEnableEditable()
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(this.span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  updateContent (value) {
    const { elementAccessPoint } = this.props
    if (!value) {
      this.span.innerText = elementAccessPoint.cook().getName()
    }
    elementAccessPoint.set('customHeaderTitle', value)
    this.setState({
      editable: false
    })
  }

  handleBlurValidateContent () {
    const value = this.span.innerText.trim()
    this.updateContent(value)
  }

  handleKeyDownPreventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span.blur()
      this.handleBlurValidateContent()
    }
  }

  handleClickGoBack () {
    const { parentElementId, options } = this.props.options
    // If multiple nesting used we can goBack only to ROOT
    if (this.props.isEditFormSettingsOpened) {
      this.props.handleEditFormSettingsToggle()
    } else if (this.props.isElementReplaceOpened) {
      this.props.handleReplaceElementToggle()
    } else {
      let accessPoint = elementAccessPointService.getInstance(parentElementId)
      while (accessPoint.inner) {
        if (accessPoint.parentElementId) {
          accessPoint = elementAccessPointService.getInstance(parentElementId)
        } else {
          break
        }
      }
      workspaceStorage.trigger('edit', accessPoint.id, accessPoint.tag, options)
    }
  }

  handleClickCloseContent (e) {
    e && e.preventDefault()
    workspaceSettings.set(false)
  }

  handleClickHide () {
    workspaceStorage.trigger('hide', this.props.elementAccessPoint.id)
  }

  handleLockElementToggle () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const isAddonAvailable = env('VCV_ADDON_ROLE_MANAGER_ENABLED')
    if (isAddonAvailable) {
      const { elementAccessPoint } = this.props
      const options = {}
      const cookElement = elementAccessPoint.cook()
      if (cookElement.containerFor().length > 0) {
        options.lockInnerElements = true
        options.action = !documentManager.get(elementAccessPoint.id).metaIsElementLocked ? 'lock' : 'unlock'
      }
      workspaceStorage.trigger('lock', elementAccessPoint.id, options)
    } else {
      const localizations = dataManager.get('localizations')
      const goPremiumText = localizations ? localizations.goPremium : 'Go Premium'
      const downloadAddonText = localizations ? localizations.downloadTheAddon : 'Download The Addon'
      const descriptionFree = localizations.elementLockPremiumFeatureText || 'With Visual Composer Premium, you can lock or unlock elements to manage who will be able to edit them.'
      const descriptionPremium = localizations.elementLockFeatureActivateAddonText || 'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements. <br> You can lock/unlock specific elements under the element Edit window. <br> To get access to this feature, download the Role Manager addon from the Visual Composer Hub.'
      const description = isPremiumActivated ? descriptionPremium : descriptionFree
      const fullScreenPopupData = {
        headingText: localizations.elementLockPremiumFeatureHeading || 'Element Lock is a Premium feature',
        buttonText: isPremiumActivated ? downloadAddonText : goPremiumText,
        description: description,
        addonName: 'roleManager',
        isPremiumActivated: isPremiumActivated
      }
      if (isPremiumActivated) {
        fullScreenPopupData.clickSettings = {
          action: 'addHub',
          options: {
            filterType: 'addon',
            id: 3,
            bundleType: undefined
          }
        }
      } else {
        const utm = dataManager.get('utm')
        fullScreenPopupData.url = utm['editor-hub-popup-teaser'].replace('{medium}', 'elementlock-editform-editor')
      }
      const allAddons = hubAddonsStorage.state('addons').get()
      if (allAddons.roleManager) {
        const successMessage = localizations.successAddonDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.'
        store.dispatch(notificationAdded({
          type: 'warning',
          text: successMessage.replace('{name}', 'Role Manager'),
          time: 8000
        }))
      } else {
        store.dispatch(fullScreenPopupDataSet(fullScreenPopupData))
        store.dispatch(activeFullPopupSet('premium-teaser'))
      }
    }
  }

  handleOutsideClick (e) {
    const menuControl = e.target.closest('.vcv-ui-edit-form-header-menu')

    if (menuControl) {
      return
    }

    this.handleToggleDropdown()
  }

  handleToggleDropdown () {
    if (this.state.isDropdownActive) {
      window.document.removeEventListener('click', this.handleOutsideClick)
    } else {
      window.document.addEventListener('click', this.handleOutsideClick)
    }
    this.setState({ isDropdownActive: !this.state.isDropdownActive })
  }

  handleRemoveElement () {
    const eventOptions = this.props.options
    workspaceStorage.trigger('remove', this.props.elementAccessPoint.id, this.props.elementAccessPoint.tag, eventOptions)
  }

  handleSaveAsPreset () {
    this.setState({ isPresetActive: !this.state.isPresetActive })
    if (this.state.isPresetActive) {
      this.handleClickGoBack()
    } else {
      this.props.handleEditFormSettingsToggle()
    }
  }

  render () {
    const {
      elementAccessPoint,
      options,
      isEditFormSettingsOpened,
      isElementReplaceOpened,
      handleReplaceElementToggle
    } = this.props

    let { content, editable, hidden, isLocked, isPresetActive } = this.state
    const isNested = options && (options.child || options.nestedAttr)
    const headerTitleClasses = classNames({
      'vcv-ui-edit-form-header-title': true,
      active: editable
    })
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    const localizations = dataManager.get('localizations')
    const closeTitle = localizations ? localizations.close : 'Close'
    const backToParentTitle = localizations ? localizations.backToParent : 'Back to parent'
    let backButton = null
    if (isNested || isEditFormSettingsOpened || isElementReplaceOpened) {
      backButton = (
        <span className='vcv-ui-edit-form-back-button' onClick={this.handleClickGoBack} title={backToParentTitle}>
          <i className='vcv-ui-icon vcv-ui-icon-chevron-left' />
        </span>
      )
    }

    if (isNested && options.activeParamGroupTitle) {
      content = options.activeParamGroupTitle
    }

    const sectionImageSrc = hubElementsService.getElementIcon(elementAccessPoint.tag)
    let sectionImage = null
    if (sectionImageSrc) {
      sectionImage = <img className='vcv-ui-edit-form-header-image' src={sectionImageSrc} title={content} />
    }

    let headerTitle
    if (isNested && options.activeParamGroup) {
      headerTitle = <span className={headerTitleClasses} ref={span => { this.span = span }}>{content}</span>
    } else {
      headerTitle = (
        <span
          className={headerTitleClasses}
          ref={span => { this.span = span }}
          contentEditable={editable}
          suppressContentEditableWarning
          onClick={this.handleClickEnableEditable}
          onKeyDown={this.handleKeyDownPreventNewLine}
          onBlur={this.handleBlurValidateContent}
        >
          {content}
        </span>
      )
    }

    let hideControl = null
    if (elementAccessPoint.tag !== 'column') {
      const iconClasses = classNames({
        'vcv-ui-icon': true,
        'vcv-ui-icon-eye-on': !hidden,
        'vcv-ui-icon-eye-off': hidden
      })
      let visibilityText = ''
      if (hidden) {
        visibilityText = localizations ? localizations.hideOn : 'Hide Element'
      } else {
        visibilityText = localizations ? localizations.hideOff : 'Show Element'
      }
      hideControl = (
        <span
          className='vcv-ui-edit-form-header-control'
          onClick={this.handleClickHide}
        >
          <i className={iconClasses} />
          <span className='vcv-ui-edit-form-header-control-title'>{visibilityText}</span>
        </span>
      )
    }

    let presetControl = null
    const cookElement = elementAccessPoint.cook()
    const isRoot = cookElement.relatedTo('RootElements')
    const isGeneral = cookElement.relatedTo('General') && !isRoot
    const isPresetsEnabled = isGeneral && roleManager.can('editor_content_presets_management', roleManager.defaultTrue())
    const isBlocksEnabled = isRoot && roleManager.can('editor_content_user_blocks_management', roleManager.defaultTrue())

    if (isPresetsEnabled || isBlocksEnabled) {
      const saveAsPreset = localizations.saveAsPreset || 'Save as a Preset'
      const saveAsTemplate = localizations.saveAsBlock || 'Save as a Block'
      const editElement = localizations.editElement || 'Edit Element'
      const saveAsText = isRoot ? saveAsTemplate : saveAsPreset
      const controlText = isPresetActive ? editElement : saveAsText

      presetControl = (
        <span
          className='vcv-ui-edit-form-header-control'
          onClick={this.handleSaveAsPreset}
        >
          <i className='vcv-ui-icon vcv-ui-icon-heart-stroke' />
          <span className='vcv-ui-edit-form-header-control-title'>{controlText}</span>
        </span>
      )
    }

    const lockElementClasses = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-lock-fill': isLocked,
      'vcv-ui-icon-unlock-fill': !isLocked
    })

    let lockControl = null
    if (roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) && (isGeneral || isRoot)) {
      const isAddonAvailable = hubStorage.state('addons').get() && hubStorage.state('addons').get().roleManager
      const lockElementText = localizations.lockElementText || 'Lock Element'
      const unlockElementText = localizations.unlockElementText || 'Ulnock Element'
      const lockText = isLocked ? unlockElementText : lockElementText

      const lockClasses = classNames({
        'vcv-ui-edit-form-header-control': true,
        'vcv-ui-edit-form-header-control--disabled': !isAddonAvailable
      })
      lockControl = (
        <span
          className={lockClasses}
          onClick={this.handleLockElementToggle}
        >
          <i className={lockElementClasses} />
          <span className='vcv-ui-edit-form-header-control-title'>{lockText}</span>
        </span>
      )
    }

    let replaceElementIcon = null
    const isRootElement = cookElement.relatedTo('RootElements') || !cookElement.relatedTo('General')
    if (!isRootElement && isAbleToAdd) {
      const category = hubElementsService.getElementCategoryName(elementAccessPoint.tag) || ''
      const isReplaceShown = this.props.getReplaceShownStatus(category)
      if (isReplaceShown) {
        const substituteElementText = localizations ? localizations.substituteElement : 'Substitute Element'
        replaceElementIcon = (
          <span
            className='vcv-ui-edit-form-header-control'
            onClick={handleReplaceElementToggle}
          >
            <i className='vcv-ui-icon vcv-ui-icon-swap' />
            <span className='vcv-ui-edit-form-header-control-title'>{substituteElementText}</span>
          </span>
        )
      }
    }

    const removeElementText = localizations.removeElement || 'Remove Element'
    const removeElementControl = (
      <span
        className='vcv-ui-edit-form-header-control'
        onClick={this.handleRemoveElement}
      >
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
        <span className='vcv-ui-edit-form-header-control-title'>{removeElementText}</span>
      </span>
    )

    const dropdownClasses = classNames({
      'vcv-ui-edit-form-header-dropdown': true,
      'vcv-ui-edit-form-header-dropdown--active': this.state.isDropdownActive
    })

    const dropdown = <dt className={dropdownClasses}>
      {replaceElementIcon}
      {lockControl}
      {hideControl}
      {presetControl}
      {removeElementControl}
    </dt>

    const settingsText = localizations.editFormSettingsText || 'Element Settings'
    const settingsIcon = <dl className='vcv-ui-edit-form-header-menu'>
      <dt onClick={this.handleToggleDropdown}>
        <span
          className='vcv-ui-edit-form-header-control'
          title={settingsText}
        >
          <i className='vcv-ui-icon vcv-ui-icon-drag-dots' />
        </span>
      </dt>
      {dropdown}
    </dl>

    return (
      <div className='vcv-ui-edit-form-header'>
        {backButton}
        {sectionImage}
        {headerTitle}
        <span className='vcv-ui-edit-form-header-control-container'>
          {settingsIcon}
          <span
            className='vcv-ui-edit-form-header-control'
            title={closeTitle}
            onClick={this.handleClickCloseContent}
          >
            <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
          </span>
        </span>
      </div>
    )
  }
}
