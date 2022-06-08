import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicField/dynamicAttribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachImageList from './attachImageList'
import FilterList from './filterList'
import Toggle from '../toggle/Component'
import { SortableContainer, arrayMove } from 'react-sortable-hoc'
import PropTypes from 'prop-types'
import StockMediaTab from './stockMediaTab'
import GiphyMediaTab from './giphyMediaTab'
import { getService, getStorage } from 'vc-cake'
import { Provider } from 'react-redux'
import store from 'public/editor/stores/store'
import { portalChanged } from 'public/editor/stores/notifications/slice'

const { getBlockRegexp } = getService('utils')
const roleManager = getService('roleManager')
const blockRegexp = getBlockRegexp()
const workspaceStorage = getStorage('workspace')

const SortableList = SortableContainer((props) => {
  return (
    <AttachImageList {...props} />
  )
})

export default class AttachImage extends Attribute {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]).isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    updater: PropTypes.func.isRequired,
    elementAccessPoint: PropTypes.object,
    onDynamicFieldOpen: PropTypes.func,
    onDynamicFieldChange: PropTypes.func,
    onDynamicFieldClose: PropTypes.func,
    defaultValue: PropTypes.any,
    options: PropTypes.any
  }

  static defaultProps = {
    fieldType: 'attachimage'
  }

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.tabsContainer = null
    this.uploadFileList = []
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.onMediaSelect = this.onMediaSelect.bind(this)
    this.onMediaOpen = this.onMediaOpen.bind(this)
    this.onMediaClose = this.onMediaClose.bind(this)
    this.openLibrary = this.openLibrary.bind(this)
    this.getUrlHtml = this.getUrlHtml.bind(this)
    this.handleSortEnd = this.handleSortEnd.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.handleDynamicFieldChange = this.handleDynamicFieldChange.bind(this)
    this.handleDynamicFieldClose = this.handleDynamicFieldClose.bind(this)
    this.customDynamicRender = this.customDynamicRender.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleUploadFiles = this.handleUploadFiles.bind(this)
    this.closeMediaPopup = this.closeMediaPopup.bind(this)
    this.init = this.init.bind(this)

    this.state.extraAttributes = {
      url: props.options.url
    }

    this.initMediaGlobals()
    this.init()
  }

  init () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }

    const oldMediaFrameSelect = window.wp.media.view.MediaFrame.Select

    const attributeOptions = this.props.options
    window.wp.media.view.MediaFrame.Select = oldMediaFrameSelect.extend({
      /**
       * Bind region mode event callbacks.
       * Add stock image tab event listeners
       * @see media.controller.Region.render
       */
      bindHandlers: function () {
        oldMediaFrameSelect.prototype.bindHandlers.apply(this, arguments)
        this.off('content:render:unsplash', this.stockImagesContent, this)
        this.on('content:render:unsplash', this.stockImagesContent, this)
        if (attributeOptions.gif) {
          this.off('content:render:giphy', this.giphyContent, this)
          this.on('content:render:giphy', this.giphyContent, this)
        }
      },
      /**
       * Show stock Images tab content
       */
      stockImagesContent: function () {
        this.content.set(new CustomStockImagesView({
          controller: this
        }))
      },
      /**
       * Show Giphy tab content
       */
      giphyContent: function () {
        this.content.set(new CustomGiphyView({
          controller: this
        }))
      },
      /**
       * Create tabs in Media Library
       * Clear existing, and re-render based on conditions
       * @param routerView
       */
      browseRouter: function (routerView) {
        oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments)
        if (roleManager.can('hub_unsplash', roleManager.defaultTrue())) {
          routerView.set('unsplash', {
            text: 'Stock Images',
            priority: 60
          })
        }

        if (roleManager.can('hub_giphy', roleManager.defaultTrue())) {
          if (attributeOptions.gif) {
            routerView.set('giphy', {
              text: 'Giphy',
              priority: 70
            })
          } else {
            routerView.unset('giphy')
          }
        }
      }
    })

    this.mediaUploader = window.wp.media({
      title: 'Add images',
      // Tell the modal to show only images.
      frame: 'select',
      library: {
        type: 'image',
        query: false
      },
      multiple: this.props.options.multiple ? 'add' : false
    })
    /* eslint-disable */
    const _this = this
    /* eslint-enable */
    const CustomStockImagesView = window.wp.media.View.extend({
      /**
       * Remove Stock images tab content
       * @returns {CustomStockImagesView}
       */
      remove: function () {
        ReactDOM.unmountComponentAtNode(this.$el.get(0))
        window.setTimeout(() => {
          if (_this.mediaUploader.state() && _this.mediaUploader.state().get('library')) {
            _this.mediaUploader.state().get('library')._requery(true)
          }
        }, 0)
        return this
      },
      /**
       * Stock images tab content render
       * @returns {CustomStockImagesView}
       */
      render: function () {
        _this.tabsContainer = this.$el.get(0)
        ReactDOM.render(<Provider store={store}><StockMediaTab /></Provider>, _this.tabsContainer)
        return this
      }
    })
    const CustomGiphyView = window.wp.media.View.extend({
      /**
       * Remove Giphy tab content
       * @returns {CustomGiphyView}
       */
      remove: function () {
        ReactDOM.unmountComponentAtNode(this.$el.get(0))
        window.setTimeout(() => {
          if (_this.mediaUploader.state() && _this.mediaUploader.state().get('library')) {
            _this.mediaUploader.state().get('library')._requery(true)
          }
        }, 0)
        return this
      },
      /**
       * Giphy tab content render
       * @returns {CustomGiphyView}
       */
      render: function () {
        _this.tabsContainer = this.$el.get(0)
        ReactDOM.render(<Provider store={store}><GiphyMediaTab /></Provider>, _this.tabsContainer)
        return this
      }
    })

    // Set default tab to be Upload Files in Add images modal
    window.wp.media.controller.Library.prototype.defaults.contentUserSetting = false

    // Create a callback when the uploader is called
    this.mediaUploader.on('select', this.onMediaSelect)
    this.mediaUploader.on('open', this.onMediaOpen)
    this.mediaUploader.on('close', this.onMediaClose)
    this.mediaUploader.on('uploader:ready', this.onMediaOpen)
  }

  componentDidMount () {
    document.addEventListener('keyup', this.closeMediaPopup)
  }

  componentWillUnmount () {
    if (this.tabsContainer) {
      ReactDOM.unmountComponentAtNode(this.tabsContainer)
    }
    document.removeEventListener('keyup', this.closeMediaPopup)
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = value ? { ids: [null], urls: [{ full: value }] } : { ids: [], urls: [] }
      if (value && this.state && this.state.value && this.state.value.urls && this.state.value.urls[0]) {
        if (this.state.value.urls[0].filter && value.urls[0]) {
          value.urls[0].filter = this.state.value.urls[0].filter
        }
        if (this.state.value.urls[0].link && value.urls[0]) {
          value.urls[0].link = this.state.value.urls[0].link
        }
      }
    } else if (lodash.isArray(value)) {
      if (value.length > 0) {
        const ids = []
        const urls = []
        value.forEach((url) => {
          ids.push(url.id)
          if (url.full) {
            urls.push(url)
          } else {
            urls.push({ full: url })
          }
        })
        value = { ids: ids, urls: urls }
      } else {
        value = { ids: [], urls: [] }
      }
    } else {
      if (!value.ids && !value.urls && value.id) {
        value = {
          ids: [value.id],
          urls: [value]
        }
      }
    }

    const filter = (value.urls && value.urls[0] && value.urls[0].filter && value.urls[0].filter !== 'normal') || false
    return {
      value: value,
      filter
    }
  }

  openLibrary () {
    if (!this.mediaUploader) {
      throw new Error('Media uploader not found. Make sure you are running this on WordPress.')
    }
    this.mediaUploaderOpen = this.mediaUploader.open()
  }

  handleRemove (key) {
    const ids = [...this.state.value.ids]
    const urls = [...this.state.value.urls]
    ids.splice(key, 1)
    urls.splice(key, 1)
    const fieldValue = {
      ids: ids,
      urls: urls
    }
    this.setFieldValue(fieldValue)
  }

  setFieldValue (value) {
    if (typeof value === 'string') {
      const newState = this.updateState({ value: value })
      value = newState.value
    }
    super.setFieldValue(value)
  }

  onMediaSelect () {
    const selection = this.mediaUploader.state().get('selection')
    const parsedSelection = this.parseSelection(selection)
    if (parsedSelection && parsedSelection.urls && parsedSelection.urls.length) {
      this.setFieldValue(parsedSelection)
    }
  }

  parseSelection (selection) {
    const defaultLinkValue = {
      relNofollow: false,
      targetBlank: true,
      title: '',
      url: ''
    }
    const ids = []
    const urls = []
    selection.forEach((attachment, index) => {
      const attachmentData = this.mediaAttachmentParse(attachment)
      if (!attachmentData || !attachmentData.url || !attachmentData.url.full) {
        return
      }
      const url = Object.assign({}, attachmentData.url)
      ids.push(attachmentData.id)

      url.link = defaultLinkValue
      if (this.state.value.urls && typeof this.state.value.urls[index] !== 'undefined' && typeof this.state.value.urls[index].link !== 'undefined') {
        url.link = this.state.value.urls[index].link
      }
      urls.push(url)
    })

    return {
      ids: ids,
      urls: urls
    }
  }

  updateExtraAttributesStates (attribute, state) {
    const { extraAttributes } = this.state
    extraAttributes[attribute] = state
    this.setState({ extraAttributes: extraAttributes })
  }

  mediaAttachmentParse (attachment) {
    attachment = attachment.toJSON()
    const srcUrl = {}
    for (const size in attachment.sizes) {
      srcUrl[size] = attachment.sizes[size].url
    }
    srcUrl.id = attachment.id
    srcUrl.title = attachment.title
    srcUrl.alt = attachment.alt
    srcUrl.caption = attachment.caption

    return {
      id: attachment.id,
      url: srcUrl
    }
  }

  handleUrlChange (key, fieldKey, urlValue) {
    const stateValue = this.state.value
    stateValue.urls[key].link = urlValue
    this.updateFieldValue(stateValue)
  }

  handleFilterChange (filterName) {
    const stateValue = { ...this.state.value }
    stateValue.urls = stateValue.urls.map(image => {
      const newImage = { ...image }
      newImage.filter = filterName
      return newImage
    })
    this.updateFieldValue(stateValue)
  }

  toggleFilter (fieldKey, value) {
    this.setState({
      filter: value
    }, () => {
      if (!value) {
        this.handleFilterChange('normal')
      }
    })
  }

  updateFieldValue (value) {
    const mergedValue = { ...this.state.value, ...value }
    this.setFieldValue(mergedValue)
  }

  onMediaOpen () {
    if (this.mediaUploader.state() && this.mediaUploader.state().get('library')) {
      this.mediaUploader.state().get('library')._requery(true)
    }
    const selection = this.mediaUploader.state().get('selection')
    const ids = this.state.value.ids
    ids && ids.forEach(function (id) {
      if (id) {
        const attachment = window.wp.media.attachment(id)
        attachment.fetch()
        if (attachment) {
          selection.add([attachment])
        }
      }
    })
    store.dispatch(portalChanged('.media-frame'))
    workspaceStorage.state('hasModal').set(true)
  }

  onMediaClose () {
    store.dispatch(portalChanged(null))

    setTimeout(() =>
      workspaceStorage.state('hasModal').set(false)
    , 100)
  }

  closeMediaPopup (e) {
    if (e?.which === 27) {
      this.mediaUploader.close()
    }
  }

  getUrlHtml (key) {
    let urlHtml = ''
    const show = this.state.extraAttributes.url
    if (show) {
      const urlValue = this.state.value.urls[key].link || ''
      const imageLink = true
      const defaultValue = { url: '', title: '', targetBlank: false, relNofollow: false }
      urlHtml = (
        <Url
          value={urlValue}
          updater={this.handleUrlChange.bind(this, key)}
          api={this.props.api}
          fieldKey={`${this.props.fieldKey}.linkUrl`}
          options={this.props.options}
          elementAccessPoint={this.props.elementAccessPoint}
          onDynamicFieldChange={this.props.onDynamicFieldChange}
          defaultValue={defaultValue}
          imageLink={imageLink}
        />
      )
    }
    return urlHtml
  }

  handleSortEnd ({ oldIndex, newIndex }) {
    const prevState = Object.assign({}, this.state.value)
    const sortedValue = {}
    sortedValue.urls = arrayMove(prevState.urls, oldIndex, newIndex)
    sortedValue.ids = arrayMove(prevState.ids, oldIndex, newIndex)
    this.setFieldValue(sortedValue)
  }

  customDynamicRender (dynamicApi) {
    const { dynamicFieldOpened, isWindowOpen } = dynamicApi.state
    const { value } = this.state
    let content = ''
    if (dynamicFieldOpened) {
      let urlClasses = 'vcv-ui-form-attach-image-url-dynamic'
      if (value && value.urls && value.urls[0] && value.urls[0] && value.urls[0].link && value.urls[0].link.url) {
        urlClasses += ' vcv-ui-form-attach-image-item-has-link-value'
      }
      const urlHtml = (
        <div className={urlClasses}>
          {this.getUrlHtml(0)}
        </div>
      )
      content = (
        <div className='vcv-ui-form-attach-image-item-inner vcv-ui-form-attach-image-item-inner--dynamic'>
          {dynamicApi.renderDynamicInputs(urlHtml)}
        </div>
      )
    }

    let dynamicValue = value
    if (value && Object.prototype.hasOwnProperty.call(value, 'urls')) {
      dynamicValue = value.urls[0] && value.urls[0].full ? value.urls[0].full : ''
    }
    const isDynamicValue = !!(dynamicValue && typeof dynamicValue === 'string' && dynamicValue.match(blockRegexp))

    if (isDynamicValue !== !!dynamicFieldOpened) {
      return null
    }

    if (!dynamicFieldOpened) {
      content = (
        <div className={dynamicApi.props.attachImageClassNames}>
          {dynamicApi.props.getAttachImageComponent(dynamicApi)}
        </div>
      )
    }

    return (
      <>
        {content}
        {isWindowOpen ? dynamicApi.getDynamicPopup() : null}
      </>
    )
  }

  handleDynamicFieldClose () {
    this.setFieldValue('')
    this.props.onDynamicFieldClose && this.props.onDynamicFieldClose()
  }

  getDynamicButtonHtml (dynamicApi) {
    return dynamicApi.renderOpenButton()
  }

  handleDynamicFieldChange (dynamicFieldKey, sourceId, forceSaveSourceId = false) {
    const dynamicValue = this.props.onDynamicFieldChange(dynamicFieldKey, sourceId, forceSaveSourceId)
    let newValue = dynamicValue
    const { value } = this.state

    if (value && value.urls && value.urls[0] && value.urls[0].full) {
      newValue = value
      newValue.urls[0].full = dynamicValue
    }

    return { fieldValue: newValue, dynamicValue: dynamicValue }
  }

  handleDrop (event) {
    event.stopPropagation()
    event.preventDefault()
    this.uploadFileList = event.dataTransfer.files
    this.mediaUploader.on('open', this.handleUploadFiles)
    this.openLibrary()
  }

  handleUploadFiles () {
    window.setTimeout(() => {
      if (this.mediaUploaderOpen && this.mediaUploaderOpen.uploader && this.mediaUploaderOpen.uploader.uploader) {
        this.mediaUploaderOpen.uploader.uploader.uploader.addFile(lodash.toArray(this.uploadFileList))
      }
      this.uploadFileList = []
      this.mediaUploader.off('open', this.handleUploadFiles)
    }, 200)
  }

  getAttachImageComponent (dynamicApi) {
    const useDragHandle = true
    const cookElement = this.props.elementAccessPoint && this.props.elementAccessPoint.cook()
    const metaAssetsPath = cookElement ? cookElement.get('metaAssetsPath') : ''
    const dragClass = 'vcv-ui-form-attach-image-item--dragging'

    return (
      <SortableList
        {...this.props}
        metaAssetsPath={metaAssetsPath}
        helperClass={dragClass}
        useDragHandle={useDragHandle}
        onSortEnd={this.handleSortEnd}
        axis='xy'
        value={this.state.value}
        openLibrary={this.openLibrary}
        onRemove={this.handleRemove}
        getUrlHtml={this.getUrlHtml}
        dynamicApi={dynamicApi}
        onHandleDrop={this.handleDrop}
      />
    )
  }

  render () {
    const { options } = this.props
    const { value, filter = false } = this.state

    let filterControl = (
      <div className='vcv-ui-form-attach-image-filter-toggle'>
        <Toggle
          value={filter} fieldKey={`enableFilter_${this.props.fieldKey}`} updater={this.toggleFilter}
          options={{ labelText: 'Enable Instagram-like filters' }}
        />
      </div>
    )

    let filterList = null
    if (filter && this.props.elementAccessPoint) {
      const cookElement = this.props.elementAccessPoint.cook()
      const metaAssetsPath = cookElement.get('metaAssetsPath')
      filterList = (
        <FilterList
          onFilterChange={this.handleFilterChange}
          images={value}
          metaAssetsPath={metaAssetsPath}
        />
      )
    }

    if (!options.imageFilter || (value && value.urls && value.urls.length < 1)) {
      filterControl = ''
      filterList = ''
    }

    const isDynamic = options && options.dynamicField
    const fieldClassNames = classNames({
      'vcv-ui-form-attach-image': true,
      'vcv-ui-form-field-dynamic': isDynamic
    })

    let dynamicValue = value

    if (value && Object.prototype.hasOwnProperty.call(value, 'urls')) {
      dynamicValue = value.urls[0] && value.urls[0].full ? value.urls[0].full : ''
    }

    let dynamicAttribute = null
    if (options && (typeof options.imageSelector === 'undefined' || options.imageSelector === true)) {
      dynamicAttribute = (
        <DynamicAttribute
          {...this.props}
          setFieldValue={this.setFieldValue}
          value={dynamicValue}
          attachImageClassNames={fieldClassNames}
          getAttachImageComponent={this.getAttachImageComponent.bind(this)}
          render={this.customDynamicRender.bind(this)}
          onDynamicFieldChange={this.handleDynamicFieldChange}
          onOpen={this.props.onDynamicFieldOpen}
          onClose={this.handleDynamicFieldClose}
        >
          <div className={fieldClassNames}>
            {this.getAttachImageComponent(false)}
          </div>
        </DynamicAttribute>
      )
    }

    return (
      <>
        {dynamicAttribute}
        {filterControl}
        {filterList}
      </>
    )
  }
}
