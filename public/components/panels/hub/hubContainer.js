import React from 'react'
import classNames from 'classnames'
import HubItemController from './hubItemController'
import NavigationSlider from 'public/components/navigationSlider/navigationSlider'
import Scrollbar from '../../scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import getHubControls from './categoriesSettings.js'
import GiphyContainer from '../../stockMedia/giphyContainer'
import UnsplashContainer from '../../stockMedia/unsplashContainer'
import Notifications from '../../notifications/notifications'
import TermsBox from '../../termsBox/component'

const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')
const cook = vcCake.getService('cook')
const dataProcessor = vcCake.getService('dataProcessor')
const hubElementsStorage = vcCake.getStorage('hubElements')
const workspaceStorage = vcCake.getStorage('workspace')
const hubAddonsStorage = vcCake.getStorage('hubAddons')
const hubTemplateStorage = vcCake.getStorage('hubTemplates')
const elementsStorage = vcCake.getStorage('elements')
const dataManager = vcCake.getService('dataManager')
const editorPopupStorage = vcCake.getStorage('editorPopup')
const hubElementsService = vcCake.getService('hubElements')
const workspaceContentState = workspaceStorage.state('content')
const settingsStorage = vcCake.getStorage('settings')

export default class HubContainer extends React.Component {
  static localizations = dataManager.get('localizations')
  allCategories = null
  static minusThreeDayTimeStamp = dataManager.get('hubServerTime') - 3 * 86400

  constructor (props) {
    super(props)
    this.categories = getHubControls()
    const firstKey = Object.keys(this.categories)[0]
    this.state = {
      filterType: firstKey,
      activeCategoryIndex: this.categories[firstKey].index,
      isVisible: props.visible || workspaceContentState.get() === 'addHubElement',
      isHubTermsAccepted: !(settingsStorage.state('agreeHubTerms').get() === false)
    }

    const workspaceState = workspaceStorage.state('settings').get()
    if (workspaceState && workspaceState.options && workspaceState.options.filterType) {
      const { filterType, id, bundleType } = workspaceState.options
      this.state.filterType = filterType
      this.state.activeCategoryIndex = id
      this.state.bundleType = bundleType
    }
    if (props.namespace === 'vcdashboard') {
      const filterType = Object.keys(this.categories).filter(category => this.categories[category].visible)
      const firstCategory = filterType[0]
      this.state.filterType = firstCategory
      this.state.activeCategoryIndex = this.categories[firstCategory].index
    }
    this.changeInput = this.changeInput.bind(this)
    this.addElement = this.addElement.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.setFilterType = this.setFilterType.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleLockClick = this.handleLockClick.bind(this)
    this.handleForceUpdateCategories = this.handleForceUpdateCategories.bind(this)
    this.handleWorkspaceSettingsChange = this.handleWorkspaceSettingsChange.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
    this.scrollToElementInsideFrame = this.scrollToElementInsideFrame.bind(this)
  }

  componentDidMount () {
    if (this.props.hideScrollbar) {
      window.addEventListener('scroll', this.handleScroll)
    }
    hubElementsStorage.state('elementTeasers').onChange(this.handleForceUpdateCategories)
    hubAddonsStorage.state('addonTeasers').onChange(this.handleForceUpdateCategories)
    hubTemplateStorage.state('templateTeasers').onChange(this.handleForceUpdateCategories)
    workspaceStorage.state('settings').onChange(this.handleWorkspaceSettingsChange)
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    if (this.props.hideScrollbar) {
      window.removeEventListener('scroll', this.handleScroll)
    }
    hubElementsStorage.state('elementTeasers').ignoreChange(this.handleForceUpdateCategories)
    hubAddonsStorage.state('addonTeasers').ignoreChange(this.handleForceUpdateCategories)
    hubTemplateStorage.state('templateTeasers').ignoreChange(this.handleForceUpdateCategories)
    workspaceStorage.state('settings').ignoreChange(this.handleWorkspaceSettingsChange)
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    const workspaceState = workspaceStorage.state('settings').get()
    if (workspaceState && workspaceState.options) {
      this.handleWorkspaceSettingsChange(workspaceState.options)
    }

    this.setState({
      isVisible: activePanel === 'addHubElement',
      inputValue: ''
    })
  }

  handleWorkspaceSettingsChange (options) {
    if (options.filterType) {
      const { filterType, id, bundleType } = options
      this.setState({
        filterType: filterType,
        activeCategoryIndex: id,
        bundleType: bundleType
      })
    }
  }

  handleForceUpdateCategories () {
    this.allCategories = false
    this.getAllCategories()
  }

  getAllCategories () {
    if (!this.allCategories) {
      const elementGroup = this.categories.element ? this.getElementGroup(this.categories.element) : null
      const templateGroup = this.categories.template ? this.getTemplateGroup(this.categories.template) : null
      const blockGroup = this.categories.block ? this.getBlockGroup(this.categories.block) : null
      const addonsGroup = this.categories.addon ? this.getAddonsGroup(this.categories.addon) : null
      const headerGroup = this.categories.hubHeader ? this.getHFSGroup(this.categories.hubHeader) : null
      const footerGroup = this.categories.hubFooter ? this.getHFSGroup(this.categories.hubFooter) : null
      const sidebarGroup = this.categories.hubSidebar ? this.getHFSGroup(this.categories.hubSidebar) : null

      this.allCategories = [elementGroup, templateGroup, blockGroup, addonsGroup, headerGroup, footerGroup, sidebarGroup].filter(a => a)
    }
    return this.allCategories
  }

  getAddonsGroup (category) {
    const { title, index } = category
    const addonTeasers = lodash.orderBy(hubAddonsStorage.state('addonTeasers').get(), (i) => typeof i.isNew !== 'undefined' && i.isNew, ['desc'])

    return { elements: addonTeasers, id: `${title}${index}`, index: index, title: title }
  }

  isItemNew = (item) => {
    if (typeof item.isNew === 'number') {
      // Show element as new for 3 days after opening
      return item.isNew > HubContainer.minusThreeDayTimeStamp
    } else {
      // Show element as new for first time
      return typeof item.isNew !== 'undefined' && item.isNew
    }
  }

  getElementGroup (category) {
    const { title, index } = category
    const elementCategories = hubElementsStorage.state('elementTeasers').get()

    const defaultElementTags = []

    // Get list of loaded elements and filter exactly default elements
    let defaultElements = Object.values(dataManager.get('hubGetElements')).filter(el => el.key !== 'column' && el.metaIsDefaultElement).map(el => {
      defaultElementTags.push(el.key)
      return {
        bundleType: ['free'],
        description: el.settings.metaDescription,
        name: el.settings.name,
        previewUrl: el.settings.metaPreviewUrl,
        tag: el.key,
        thumbnailUrl: el.settings.metaThumbnailUrl
      }
    })

    let freeElements = elementCategories[0].elements.filter(element => !element.disabledOnHub && defaultElementTags.indexOf(element.tag) === -1 && element.bundleType.includes('free'))
    let premiumElements = elementCategories[0].elements.filter(element => !element.disabledOnHub && element.bundleType.includes('premium') && !element.bundleType.includes('free'))

    defaultElements = lodash.sortBy(defaultElements, ['name'])
    freeElements = lodash.sortBy(freeElements, ['name'])
    freeElements = lodash.orderBy(freeElements, this.isItemNew, ['desc'])

    premiumElements = lodash.sortBy(premiumElements, ['name'])
    premiumElements = lodash.orderBy(premiumElements, this.isItemNew, ['desc'])

    const sortedElements = defaultElements.concat(freeElements.concat(premiumElements))

    return { elements: sortedElements, id: `${title}${index}`, index: index, title: title }
  }

  getTemplateGroup (category) {
    const { title, index } = category
    const allTemplates = hubTemplateStorage.state('templateTeasers').get()
    let freeTemplates = allTemplates.filter(template => template.templateType === 'predefined')
    let premiumTemplates = allTemplates.filter(template => template.templateType === 'hub')

    freeTemplates = lodash.orderBy(freeTemplates, this.isItemNew, ['desc'])
    premiumTemplates = lodash.orderBy(premiumTemplates, this.isItemNew, ['desc'])

    const orderedTemplates = freeTemplates.concat(premiumTemplates)

    return { elements: orderedTemplates, id: `${title}${index}`, index: index, title: title }
  }

  getBlockGroup (category) {
    const { title, index, type } = category
    const blockTeasers = lodash.orderBy(hubTemplateStorage.state('templateTeasers').get().filter((block) => {
      return block.templateType === type
    }), this.isItemNew, ['desc'])
    return { elements: blockTeasers, id: `${title}${index}`, index: index, title: title }
  }

  getHFSGroup (category) {
    const { type, title, index } = category
    if (index) {
      const templates = lodash.orderBy(hubTemplateStorage.state('templateTeasers').get().filter(template => {
        return template.templateType === type
      }), this.isItemNew, ['desc'])
      return { elements: templates, id: `${title}${index}`, index, title: title }
    }
    return {}
  }

  addElement (element, presetId = false) {
    const workspace = workspaceStorage.state('settings').get() || false
    element.parent = workspace && workspace.element ? workspace.element.id : false
    element = cook.get(element).toJS()

    elementsStorage.trigger('add', element, true, {
      insertAfter: workspace && workspace.options && workspace.options.insertAfter ? workspace.options.insertAfter : false
    })
    this.addedId = element.id
    const itemTag = element.tag
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'usageCount:updateUsage:adminNonce',
      'vcv-item-tag': itemTag,
      'vcv-nonce': dataManager.get('nonce')
    })

    const iframe = document.getElementById('vcv-editor-iframe')
    this.iframeDocument = iframe && iframe.contentWindow && iframe.contentWindow.document
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.scrollToElementInsideFrame && this.scrollToElementInsideFrame(this.addedId)
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  scrollToElementInsideFrame (id) {
    const editorEl = this.iframeDocument.querySelector(`#el-${id}`)
    if (!editorEl) {
      return
    }
    window.setTimeout(() => {
      editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 500)
  }

  getElementControl (elementData) {
    let tag = elementData.tag ? elementData.tag : elementData.name
    tag = tag.charAt(0).toLowerCase() + tag.substr(1, tag.length - 1)
    const type = elementData.type ? elementData.type : 'element'

    if (type === 'template') {
      tag = elementData.bundle.replace('template/', '').replace('predefinedTemplate/', '')
    }

    return (
      <HubItemController
        key={'vcv-item-controller-' + tag}
        element={elementData}
        tag={tag}
        type={type}
        update={elementData.update ? elementData.update : false}
        name={elementData.name}
        isNew={typeof elementData.isNew === 'number' ? elementData.isNew > HubContainer.minusThreeDayTimeStamp : !!elementData.isNew} // check if CurrentTimestamp(seconds form 1970) - 3*86400 < isNewDate()
        addElement={this.addElement}
        onClickGoPremium={this.handleLockClick}
        utmMedium={this.getUtmMedium()}
      />
    )
  }

  /**
   * This method is not unused it's used to
   * override AddElementCategories component's original method
   * @return {JSX}
   */
  getNoResultsElement () {
    const nothingFoundText = HubContainer.localizations ? HubContainer.localizations.nothingFound : 'Nothing found'

    const source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    return (
      <div className='vcv-ui-editor-no-items-container'>
        <div className='vcv-ui-editor-no-items-content'>
          <img
            className='vcv-ui-editor-no-items-image'
            src={source}
            alt={nothingFoundText}
          />
        </div>
      </div>
    )
  }

  getElementsByCategory () {
    const { activeCategoryIndex } = this.state
    const allCategories = this.getAllCategories()
    let elements = []

    if (activeCategoryIndex.indexOf && activeCategoryIndex.indexOf('-') > -1) {
      const index = activeCategoryIndex.split('-')
      const group = allCategories[index[0]]
      const category = group && group.categories && group.categories[index[1]]

      elements = category ? category.elements : []
    } else {
      elements = allCategories && allCategories[activeCategoryIndex] && allCategories[activeCategoryIndex].elements
    }

    return elements ? elements.map((elementData) => { return this.getElementControl(elementData) }) : []
  }

  getSearchProps () {
    return {
      changeInput: this.changeInput,
      inputValue: this.state.inputValue || '',
      autoFocus: this.state.isVisible,
      filterType: this.state.filterType
    }
  }

  changeInput (value) {
    this.setState({
      inputValue: value,
      searchResults: this.getSearchResults(value),
      bundleType: null
    })
  }

  getSearchResults (searchValue) {
    searchValue = searchValue.toLowerCase().trim()
    const allCategories = this.getAllCategories()

    return allCategories[this.state.activeCategoryIndex].elements.filter((elementData) => {
      const elName = hubElementsService.getElementName(elementData)
      if (elName.indexOf(searchValue) !== -1) {
        return true
      } else {
        const elDescription = hubElementsService.getElementDescription(elementData)
        return elDescription.indexOf(searchValue) !== -1
      }
    }).sort((a, b) => {
      let firstIndex = hubElementsService.getElementName(a).indexOf(searchValue)
      let secondIndex = hubElementsService.getElementName(b).indexOf(searchValue)

      // In case if found by description it goes last
      firstIndex = firstIndex === -1 ? 100 : firstIndex
      secondIndex = secondIndex === -1 ? 100 : secondIndex

      return firstIndex - secondIndex
    })
  }

  getSearchElement () {
    const searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  setFilterType (value, id, bundleType) {
    this.setState({
      filterType: value,
      activeCategoryIndex: id,
      bundleType: bundleType,
      inputValue: ''
    })
  }

  getElementListContainer (itemsOutput) {
    if (itemsOutput.length) {
      return (
        <div className='vcv-ui-item-list-container'>
          <div className='vcv-ui-item-list'>
            {itemsOutput}
          </div>
        </div>
      )
    } else {
      return this.getNoResultsElement()
    }
  }

  getFoundElements () {
    return this.state.searchResults.map((elementData) => {
      return this.getElementControl(elementData)
    })
  }

  filterResult () {
    const { filterType, bundleType } = this.state
    let result = this.state.inputValue ? this.getFoundElements() : this.getElementsByCategory()
    result = result.filter((item) => {
      let isClean = false

      if (this.categories[filterType].templateType) {
        isClean = item.props.type === 'template' && item.props.element.templateType === filterType
      } else {
        isClean = item.props.type === filterType
      }

      // filter for bundle type
      const itemBundleType = item.props.element.bundleType

      // if bundleType is not set - do not show it on free/premium
      if (bundleType && (!item.props.element.bundleType || !item.props.element.bundleType.length)) {
        isClean = false
      }

      if (isClean && itemBundleType && itemBundleType.length && bundleType) {
        isClean = itemBundleType.indexOf(bundleType) > -1

        // remove item if item has also free bundle type, when premium is clicked
        if (bundleType === 'premium' && isClean) {
          isClean = itemBundleType.indexOf('free') < 0
        }
      }

      return isClean
    })
    return result
  }

  getHubPanelControls () {
    const controls = {}

    Object.keys(this.categories).forEach(key => {
      if (this.categories[key].visible) {
        controls[key] = this.categories[key]
      }
    })

    const props = {
      controls: controls,
      activeSection: this.state.filterType,
      activeSubControl: this.state.bundleType,
      setActiveSection: this.setFilterType
    }

    return <NavigationSlider {...props} />
  }

  /**
   * Click handler for Hub item (elements, templates) Lock icon
   * @param type {string}
   */
  handleLockClick (type) {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const goPremiumText = HubContainer.localizations ? HubContainer.localizations.unlockAllFeatures : 'Unlock All Features'
    const headingPremiumText = HubContainer.localizations ? HubContainer.localizations.doMoreWithPremium : 'Do More With Premium'
    let descriptionText = ''
    if (type === 'template') {
      descriptionText = HubContainer.localizations ? HubContainer.localizations.getAccessToTemplates : 'Get access to more than 200 content elements with Visual Composer Premium.'
    } else if (type === 'element') {
      descriptionText = HubContainer.localizations ? HubContainer.localizations.getAccessToContentElements : 'Get access to more than 200 content elements with Visual Composer Premium.'
    }

    const activeFilterType = this.categories[this.state.filterType].title.toLowerCase()
    const workspaceState = workspaceStorage.state('settings').get()
    const initialFilterType = workspaceState && workspaceState.options && workspaceState.options.filterType ? '-add' + workspaceState.options.filterType : ''

    const utm = dataManager.get('utm')
    const utmMedium = `${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
    const utmLink = utm['editor-hub-popup-teaser']

    const url = utmLink.replace('{medium}', utmMedium)

    const fullScreenPopupData = {
      headingText: headingPremiumText,
      buttonText: goPremiumText,
      description: descriptionText,
      isPremiumActivated: isPremiumActivated,
      url: url
    }
    editorPopupStorage.state('fullScreenPopupData').set(fullScreenPopupData)
    editorPopupStorage.state('activeFullPopup').set('premium-teaser')
  }

  getUtmMedium () {
    const activeFilterType = this.categories[this.state.filterType].title.toLowerCase()
    const workspaceState = workspaceStorage.state('settings').get()
    const initialFilterType = workspaceState && workspaceState.options && workspaceState.options.filterType ? '-add' + workspaceState.options.filterType : ''
    return `${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
  }

  getHubBanner () {
    const titleText = HubContainer.localizations ? HubContainer.localizations.getMoreText : 'Do More With Visual Composer'
    const titleSubText = HubContainer.localizations ? HubContainer.localizations.getMoreTextSubText : 'Premium'
    const subtitleText = HubContainer.localizations ? HubContainer.localizations.downloadFromHubText : 'Get unlimited access to the Visual Composer Hub with 500+ elements, templates, addons, and integrations.'
    const buttonText = HubContainer.localizations ? HubContainer.localizations.goPremium : 'Go Premium'
    const utm = dataManager.get('utm')
    const bannerButtonUrl = utm['editor-hub-go-premium'].replace('{medium}', this.getUtmMedium())
    const refRoot = `&vcv-ref=${this.getUtmMedium()}`
    const activateUrl = `${dataManager.get('goPremiumUrl')}${refRoot}`
    const linkProps = {
      rel: 'noopener noreferrer',
      href: activateUrl,
      className: 'vcv-hub-banner-link'
    }
    if (this.props.namespace !== 'vcdashboard') {
      linkProps.target = '_blank'
    }
    const alreadyHaveLicenseText = HubContainer.localizations ? HubContainer.localizations.alreadyHaveLicenseTextOneAction : 'Already have a Premium license?'
    const activateHereText = HubContainer.localizations ? HubContainer.localizations.activateHere : 'Activate here'

    return (
      <div className='vcv-hub-banner'>
        <div className='vcv-hub-banner-content'>
          <p className='vcv-hub-banner-title'>{titleText}</p>
          <p className='vcv-hub-banner-title'>{titleSubText}</p>
          <p className='vcv-hub-banner-subtitle'>{subtitleText}</p>
          <a className='vcv-hub-banner-button' href={bannerButtonUrl} target='_blank' rel='noopener noreferrer'>
            {buttonText}
          </a>
          <p className='vcv-hub-banner-subtitle'>
            {alreadyHaveLicenseText} <a {...linkProps}>{activateHereText}</a>.
          </p>
        </div>
      </div>
    )
  }

  handleScroll (e) {
    let el = e.currentTarget
    const { filterType } = this.state
    if (filterType !== 'unsplash' && filterType !== 'giphy') {
      return
    }
    if (this.props.hideScrollbar) {
      el = e.currentTarget.document.documentElement
    }
    const clientRect = el.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const scrolledToBottom = (el.scrollTop + clientRect.height + (windowHeight / 2)) >= el.scrollHeight
    this.setState({
      scrollTop: el.scrollTop,
      scrolledToBottom: scrolledToBottom
    })
  }

  render () {
    const itemsOutput = this.filterResult()
    const innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    const filterType = this.state.filterType
    const editorPlateClasses = classNames({
      'vcv-ui-editor-plate': true,
      'vcv-ui-state--active': true,
      'vcv-ui-editor-plate--addon': filterType === 'addon'
    })

    const utm = dataManager.get('utm')
    const teaserUrl = utm['editor-hub-go-premium'].replace('{medium}', this.getUtmMedium())

    let panelContent = ''
    if (!this.state.isHubTermsAccepted) {
      panelContent = <TermsBox onPrimaryButtonClick={() => { this.setState({ isHubTermsAccepted: true }) }} />
    } else if (filterType === 'unsplash') {
      panelContent = (
        <UnsplashContainer
          scrolledToBottom={this.state.scrolledToBottom}
          scrollTop={this.state.scrollTop}
          namespace={this.props.namespace}
          filterType={filterType}
          goPremiumLink={teaserUrl}
        />
      )
    } else if (filterType === 'giphy') {
      panelContent = (
        <GiphyContainer
          scrolledToBottom={this.state.scrolledToBottom}
          scrollTop={this.state.scrollTop}
          namespace={this.props.namespace}
          filterType={filterType}
          goPremiumLink={teaserUrl}
        />
      )
    } else {
      panelContent = (
        <div className={innerSectionClasses}>
          {(typeof dataManager.get('isPremiumActivated') !== 'undefined' && !dataManager.get('isPremiumActivated')) ? this.getHubBanner() : null}
          <div className='vcv-ui-editor-plates-container vcv-ui-editor-plate--teaser'>
            <div className='vcv-ui-editor-plates'>
              <div className={editorPlateClasses}>
                {this.getElementListContainer(itemsOutput)}
              </div>
            </div>
          </div>
        </div>
      )
    }

    let hubContent = null
    if (this.props.hideScrollbar) {
      hubContent = panelContent
    } else {
      hubContent = (
        <Scrollbar onScroll={lodash.throttle(this.handleScroll, 100)}>
          {panelContent}
        </Scrollbar>
      )
    }

    let notifications = null
    if (this.props.addNotifications) {
      notifications = <Notifications />
    }

    const hubContainerClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-teaser-add-element-content': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    return (
      <div className={hubContainerClasses}>
        <div className='vcv-ui-tree-content'>
          {this.getSearchElement()}
          <div className='vcv-ui-hub-control-container'>
            {this.getHubPanelControls()}
          </div>
          <div className='vcv-ui-tree-content-section'>
            {notifications}
            {hubContent}
          </div>
        </div>
      </div>
    )
  }
}
