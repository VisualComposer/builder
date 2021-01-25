import React from 'react'
import classNames from 'classnames'
import HubItemController from './hubItemController'
import HubMenu from './hubMenu'
import HubDropdown from './hubDropdown'
import Scrollbar from '../../scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import vcCake from 'vc-cake'
import lodash from 'lodash'
import categories from './categoriesSettings.json'
import GiphyContainer from '../../stockMedia/giphyContainer'
import UnsplashContainer from '../../stockMedia/unsplashContainer'
import Notifications from '../../notifications/notifications'

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

export default class HubContainer extends React.Component {
  static localizations = dataManager.get('localizations')
  allCategories = null
  static minusThreeDayTimeStamp = dataManager.get('hubServerTime') - 3 * 86400

  constructor (props) {
    super(props)
    this.state = {
      filterType: 'all',
      activeCategoryIndex: 0
    }
    if (props && props.options && props.options.filterType) {
      const { filterType, id, bundleType } = props.options
      this.state = {
        filterType: filterType,
        activeCategoryIndex: id,
        bundleType: bundleType
      }
    }
    this.changeInput = this.changeInput.bind(this)
    this.addElement = this.addElement.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.setFilterType = this.setFilterType.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.handleClickGoPremium = this.handleClickGoPremium.bind(this)
    this.handleMediaGoPremium = this.handleMediaGoPremium.bind(this)
    this.handleLockClick = this.handleLockClick.bind(this)
    this.handleForceUpdateCategories = this.handleForceUpdateCategories.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps && nextProps.options && nextProps.options.filterType && nextProps.options.filterType !== this.state.filterType) {
      this.setState({
        filterType: nextProps.options.filterType,
        activeCategoryIndex: nextProps.options.id
      })
    }
    if (nextProps && nextProps.visible !== this.props.visible) {
      // Reset Search on re-open
      this.setState({
        inputValue: ''
      })
    }
  }

  /* eslint-enable */

  componentDidMount () {
    if (this.props.hideScrollbar) {
      window.addEventListener('scroll', this.handleScroll)
    }
    hubElementsStorage.state('elementTeasers').onChange(this.handleForceUpdateCategories)
    hubAddonsStorage.state('addonTeasers').onChange(this.handleForceUpdateCategories)
    hubTemplateStorage.state('templateTeasers').onChange(this.handleForceUpdateCategories)
  }

  componentWillUnmount () {
    if (this.props.hideScrollbar) {
      window.removeEventListener('scroll', this.handleScroll)
    }
    hubElementsStorage.state('elementTeasers').ignoreChange(this.handleForceUpdateCategories)
    hubAddonsStorage.state('addonTeasers').ignoreChange(this.handleForceUpdateCategories)
    hubTemplateStorage.state('templateTeasers').ignoreChange(this.handleForceUpdateCategories)
  }

  handleForceUpdateCategories () {
    this.allCategories = false
    this.getAllCategories()
  }

  getAllCategories () {
    if (!this.allCategories) {
      const elementGroup = this.getElementGroup(categories.element)
      const templateGroup = this.getTemplateGroup(categories.template)
      const blockGroup = this.getBlockGroup(categories.block)
      const addonsGroup = this.getAddonsGroup(categories.addon)
      const headerGroup = this.getHFSGroup(categories.hubHeader)
      const footerGroup = this.getHFSGroup(categories.hubFooter)
      const sidebarGroup = this.getHFSGroup(categories.hubSidebar)
      const allGroup = this.getAllGroup(categories.all, [elementGroup, templateGroup, blockGroup, headerGroup, footerGroup, sidebarGroup])

      this.allCategories = [allGroup, elementGroup, templateGroup, blockGroup, addonsGroup, headerGroup, footerGroup, sidebarGroup]
    }
    return this.allCategories
  }

  getAllGroup (category, otherGroups) {
    const { title, index } = category
    const elements = []

    otherGroups.forEach((group) => {
      const groupAllElements = group.categories && group.categories[0] ? group.categories[0].elements : group.elements
      if (groupAllElements) {
        elements.push(...groupAllElements)
      }
    })
    return { elements: lodash.orderBy(elements, this.isItemNew, ['desc']), id: `${title}${index}`, index: index, title: title }
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
    elementCategories[0].elements = lodash.sortBy(elementCategories[0].elements, ['name'])
    elementCategories[0].elements = lodash.orderBy(elementCategories[0].elements, this.isItemNew, ['desc'])

    return { categories: elementCategories, id: `${title}${index}`, index: index, title: title }
  }

  getTemplateGroup (category) {
    const { title, index } = category
    const templateTeasers = lodash.orderBy(hubTemplateStorage.state('templateTeasers').get().filter((template) => {
      return template.templateType === 'hub' || template.templateType === 'predefined'
    }), this.isItemNew, ['desc'])

    return { elements: templateTeasers, id: `${title}${index}`, index: index, title: title }
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
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv && this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
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

  changeActiveCategory (catIndex) {
    this.setState({
      activeCategoryIndex: catIndex
    })
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
      inputPlaceholder: 'elements and templates',
      autoFocus: this.props.visible,
      selectEvent: (active) => {
        const activeId = active && active.constructor === String && active.split('-')[0]
        const result = this.state
        const foundCategory = Object.values(categories).find(category => parseInt(activeId) === category.index)
        result.filterType = foundCategory.type
        this.setState(result)
      }
    }
  }

  changeInput (value) {
    this.setState({
      inputValue: value,
      searchResults: this.getSearchResults(value),
      bundleType: null,
      filterType: 'all',
      activeCategoryIndex: 0
    })
  }

  getSearchResults (value) {
    value = value.toLowerCase().trim()
    const allCategories = this.getAllCategories()
    const getIndex = allCategories.findIndex((val) => {
      return val.title === 'All' || val.title === 'All Elements'
    })

    function getElementName (elementData) {
      let elName = ''
      if (elementData.name) {
        elName = elementData.name.toLowerCase()
      } else if (elementData.tag) {
        const element = cook.get(elementData)
        if (element.get('name')) {
          elName = element.get('name').toLowerCase()
        }
      }

      return elName
    }

    return allCategories[getIndex].elements.filter((elementData) => {
      const elName = getElementName(elementData)
      return elName.indexOf(value) !== -1
    }).sort((a, b) => getElementName(a).indexOf(value) - getElementName(b).indexOf(value))
  }

  getSearchElement () {
    const searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  setFilterType (value, id, bundleType) {
    this.setState({
      filterType: value,
      activeCategoryIndex: id,
      bundleType: bundleType
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

      if (filterType === 'all') {
        isClean = true
      } else {
        if (categories[filterType].templateType) {
          isClean = item.props.type === 'template' && item.props.element.templateType === filterType
        } else {
          isClean = item.props.type === filterType
        }
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

  getTypeControlProps () {
    return {
      categories: categories,
      filterType: this.state.filterType,
      bundleType: this.state.bundleType,
      setFilterType: this.setFilterType
    }
  }

  getHubPanelControls () {
    return <HubMenu {...this.getTypeControlProps()} />
  }

  /**
   * Click handler for Hub item (elements, templates) Lock icon
   * @param type {string}
   * @param isFree {boolean}
   */
  handleLockClick (type, isFree) {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const activateHubText = HubContainer.localizations ? HubContainer.localizations.activateHub : 'Activate Hub'
    const goPremiumText = HubContainer.localizations ? HubContainer.localizations.unlockAllFeatures : 'Unlock All Features'
    const headingPremiumText = HubContainer.localizations ? HubContainer.localizations.doMoreWithPremium : 'Do More With Premium'
    const headingFreeText = HubContainer.localizations ? HubContainer.localizations.thisIsAFreeFeature : 'This is a free feature'
    const freeText = HubContainer.localizations ? HubContainer.localizations.getFreeLicenseToActivateVCHub : 'Get a free license to activate the Visual Composer Hub and get access to more free elements and templates.'
    let descriptionText = ''
    if (type === 'template') {
      descriptionText = HubContainer.localizations ? HubContainer.localizations.getAccessToTemplates : 'Get access to more than 200 content elements with Visual Composer Premium.'
    } else if (type === 'element') {
      descriptionText = HubContainer.localizations ? HubContainer.localizations.getAccessToContentElements : 'Get access to more than 200 content elements with Visual Composer Premium.'
    }

    const activeFilterType = categories[this.state.filterType].title.toLowerCase()
    const initialFilterType = this.props && this.props.options && this.props.options.filterType ? '-add-' + this.props.options.filterType : ''

    let url
    if (isFree) {
      const refRoot = `&vcv-ref=${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
      url = `${dataManager.get('goPremiumUrl')}${refRoot}`
    } else {
      const utm = dataManager.get('utm')
      const utmMedium = `${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
      const utmLink = utm['editor-hub-go-premium']
      url = utmLink.replace('{medium}', utmMedium)
    }

    const fullScreenPopupData = {
      headingText: isFree ? headingFreeText : headingPremiumText,
      buttonText: isFree ? activateHubText : goPremiumText,
      description: isFree ? freeText : descriptionText,
      isPremiumActivated: isPremiumActivated,
      url: url
    }
    editorPopupStorage.state('fullScreenPopupData').set(fullScreenPopupData)
    editorPopupStorage.trigger('showFullPagePopup')
  }

  /**
   * Click handler for Hub window Stock Media header button (Unsplash, Giphy)
   * @param clickedType {string}
   * @param isFree {boolean}
   */
  handleMediaGoPremium (clickedType, isFree) {
    if (isFree && clickedType === 'popup') {
      this.handleClickGoPremium()
    } else {
      const utm = dataManager.get('utm')
      const activeFilterType = categories[this.state.filterType].title.toLowerCase()
      const initialFilterType = this.props && this.props.options && this.props.options.filterType ? '-add-' + this.props.options.filterType : ''
      const utmMedium = `${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
      const utmLink = clickedType === 'button' ? utm['editor-hub-go-premium'] : utm['editor-hub-popup-teaser']
      const teaserUrl = utmLink.replace('{medium}', utmMedium)

      window.open(teaserUrl)
    }
  }

  /**
   * Click handler for Hub window header button
   * @param e
   */
  handleClickGoPremium (e) {
    e && e.preventDefault && e.preventDefault()

    const activeFilterType = categories[this.state.filterType].title.toLowerCase()
    const initialFilterType = this.props && this.props.options && this.props.options.filterType ? '-add-' + this.props.options.filterType : ''
    const refRoot = `&vcv-ref=${activeFilterType}${initialFilterType}-hub-${this.props.namespace}`
    const utmUrlRef = `${dataManager.get('goPremiumUrl')}${refRoot}`
    if (this.props.namespace === 'vc-dashboard') {
      window.location.href = utmUrlRef // open in same window
    } else {
      window.open(utmUrlRef)
    }
  }

  getHubBanner () {
    const titleText = HubContainer.localizations ? HubContainer.localizations.getMoreText : 'Connect to Visual Composer Hub.'
    const titleSubText = HubContainer.localizations ? HubContainer.localizations.getMoreTextSubText : 'Do More.'
    const subtitleText = HubContainer.localizations ? HubContainer.localizations.downloadFromHubText : 'Activate your free or premium license to get access to the Visual Composer Hub'
    const buttonText = HubContainer.localizations ? HubContainer.localizations.activationButtonTitle : dataManager.get('isFreeActivated') ? 'Go Premium' : 'Activate Visual Composer Hub'

    return (
      <div className='vcv-hub-banner'>
        <div className='vcv-hub-banner-content'>
          <p className='vcv-hub-banner-title'>{titleText}</p>
          <p className='vcv-hub-banner-title'>{titleSubText}</p>
          <p className='vcv-hub-banner-subtitle'>{subtitleText}</p>
          <span className='vcv-hub-banner-button' onClick={this.handleClickGoPremium}>
            {buttonText}
          </span>
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

    let panelContent = ''
    if (filterType === 'unsplash') {
      panelContent = (
        <UnsplashContainer
          scrolledToBottom={this.state.scrolledToBottom}
          scrollTop={this.state.scrollTop}
          namespace={this.props.namespace}
          filterType={filterType}
          onClickGoPremium={this.handleMediaGoPremium}
        />
      )
    } else if (filterType === 'giphy') {
      panelContent = (
        <GiphyContainer
          scrolledToBottom={this.state.scrolledToBottom}
          scrollTop={this.state.scrollTop}
          namespace={this.props.namespace}
          filterType={filterType}
          onClickGoPremium={this.handleMediaGoPremium}
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
      'vcv-ui-state--hidden': !this.props.visible
    })

    return (
      <div className={hubContainerClasses}>
        <div className='vcv-ui-tree-content'>
          {this.getSearchElement()}
          {this.getHubPanelControls()}
          <div className='vcv-ui-hub-dropdown-container'>
            <HubDropdown {...this.getTypeControlProps()} />
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
