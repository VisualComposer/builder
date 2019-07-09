import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Attribute from '../attribute'
import DynamicAttribute from '../dynamicAttribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachImageList from './attachImageList'
import FilterList from './filterList'
import Toggle from '../toggle/Component'
import { SortableContainer, arrayMove } from 'react-sortable-hoc'
import PropTypes from 'prop-types'
import StockImagesMediaTab from './stockImagesMediaTab'
import { env, getStorage } from 'vc-cake'

const notificationsStorage = getStorage('notifications')
const SortableList = SortableContainer((props) => {
  return (
    <AttachImageList {...props} />
  )
})

export default class AttachImage extends Attribute {
  static propTypes = {
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.object, PropTypes.array ]).isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    updater: PropTypes.func.isRequired,
    elementAccessPoint: PropTypes.object.isRequired,
    handleDynamicFieldOpen: PropTypes.func,
    handleDynamicFieldChange: PropTypes.func,
    handleDynamicFieldClose: PropTypes.func,
    defaultValue: PropTypes.any,
    options: PropTypes.any
  }

  static defaultProps = {
    fieldType: 'attachimage'
  }

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.stockImagesContainer = null
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.onMediaSelect = this.onMediaSelect.bind(this)
    this.onMediaOpen = this.onMediaOpen.bind(this)
    this.onMediaClose = this.onMediaClose.bind(this)
    this.openLibrary = this.openLibrary.bind(this)
    this.getUrlHtml = this.getUrlHtml.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)

    this.state.extraAttributes = {
      url: props.options.url
    }
  }

  componentWillUnmount () {
    if (this.stockImagesContainer) {
      ReactDOM.unmountComponentAtNode(this.stockImagesContainer)
    }
  }

  componentWillMount () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }

    let oldMediaFrameSelect = window.wp.media.view.MediaFrame.Select

    window.wp.media.view.MediaFrame.Select = oldMediaFrameSelect.extend({
      /**
       * Bind region mode event callbacks.
       * Add stock image tab event listeners
       * @see media.controller.Region.render
       */
      bindHandlers: function () {
        oldMediaFrameSelect.prototype.bindHandlers.apply(this, arguments)
        this.off('content:render:stockImages', this.stockImagesContent, this)
        this.on('content:render:stockImages', this.stockImagesContent, this)
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
       * Create Stock image tab
       * @param routerView
       */
      browseRouter: function (routerView) {
        oldMediaFrameSelect.prototype.browseRouter.apply(this, arguments)
        routerView.set('stockImages', {
          text: 'Stock Images',
          priority: 60
        })
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
      button: {
        text: 'Add image'
      },
      multiple: this.props.options.multiple ? 'add' : false
    })
    let _this = this
    let CustomStockImagesView = window.wp.media.View.extend({
      /**
       * Remove Stock images tab content
       * @returns {CustomStockImagesView}
       */
      remove: function () {
        ReactDOM.unmountComponentAtNode(this.$el.get(0))
        window.setTimeout(() => {
          if (
            _this.mediaUploader.content &&
            _this.mediaUploader.content.get('gallery') &&
            _this.mediaUploader.content.get('gallery').collection &&
            _this.mediaUploader.content.get('gallery').collection.props &&
            _this.mediaUploader.content.get('gallery').collection.props.set
          ) {
            _this.mediaUploader.content.get('gallery').collection.props.set({ ignore: (+new Date()) })
          }
        }, 0)
        return this
      },
      /**
       * Stock images tab content render
       * @returns {CustomStockImagesView}
       */
      render: function () {
        _this.stockImagesContainer = this.$el.get(0)
        ReactDOM.render(<StockImagesMediaTab />, _this.stockImagesContainer)
        return this
      }
    })

    // Create a callback when the uploader is called
    this.mediaUploader.on('select', this.onMediaSelect)
    this.mediaUploader.on('open', this.onMediaOpen)
    this.mediaUploader.on('close', this.onMediaClose)
    this.mediaUploader.on('uploader:ready', this.onMediaOpen)
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = value ? { ids: [ null ], urls: [ { full: value } ] } : { ids: [], urls: [] }
    } else if (lodash.isArray(value)) {
      if (value.length > 0) {
        let ids = []
        let urls = []
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
          ids: [ value.id ],
          urls: [ value ]
        }
      }
    }

    let filter = (value.urls && value.urls[ 0 ] && value.urls[ 0 ].filter && value.urls[ 0 ].filter !== 'normal') || false
    return {
      value: value,
      filter
    }
  }

  openLibrary () {
    if (!this.mediaUploader) {
      throw new Error('Media uploader not found. Make sure you are running this on WordPress.')
    }
    this.mediaUploader.open()
  }

  handleRemove (key) {
    let ids = this.state.value.ids
    let urls = this.state.value.urls
    ids.splice(key, 1)
    urls.splice(key, 1)
    let fieldValue = {
      ids: ids,
      urls: urls
    }
    this.setFieldValue(fieldValue)
  }

  setFieldValue (value) {
    if (typeof value === 'string') {
      let newState = this.updateState({ value: value })
      value = newState.value
    }
    super.setFieldValue(value)
  }

  onMediaSelect () {
    let selection = this.mediaUploader.state().get('selection')
    this.setFieldValue(this.parseSelection(selection))
  }

  parseSelection (selection) {
    let defaultLinkValue = {
      relNofollow: false,
      targetBlank: true,
      title: '',
      url: ''
    }
    let ids = []
    let urls = []
    selection.forEach((attachment, index) => {
      let attachmentData = this.mediaAttachmentParse(attachment)
      let url = Object.assign({}, attachmentData.url)
      ids.push(attachmentData.id)

      url.link = defaultLinkValue
      if (this.state.value.urls && typeof this.state.value.urls[ index ] !== 'undefined' && typeof this.state.value.urls[ index ].link !== 'undefined') {
        url.link = this.state.value.urls[ index ].link
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
    extraAttributes[ attribute ] = state
    this.setState({ extraAttributes: extraAttributes })
  }

  mediaAttachmentParse (attachment) {
    attachment = attachment.toJSON()
    let srcUrl = {}
    for (let size in attachment.sizes) {
      srcUrl[ size ] = attachment.sizes[ size ].url
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
    let stateValue = this.state.value
    stateValue.urls[ key ].link = urlValue
    this.updateFieldValue(stateValue)
  }

  handleFilterChange (filterName) {
    let stateValue = this.state.value
    stateValue.urls = stateValue.urls.map(image => {
      image.filter = filterName
      return image
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
    let mergedValue = lodash.merge(this.state.value, value)
    this.setFieldValue(mergedValue)
  }

  onMediaOpen () {
    if (
      this.mediaUploader.content &&
      this.mediaUploader.content.get('gallery') &&
      this.mediaUploader.content.get('gallery').collection &&
      this.mediaUploader.content.get('gallery').collection.props &&
      this.mediaUploader.content.get('gallery').collection.props.set
    ) {
      this.mediaUploader.content.get('gallery').collection.props.set({ ignore: (+new Date()) })
    }
    let selection = this.mediaUploader.state().get('selection')
    let ids = this.state.value.ids
    ids && ids.forEach(function (id) {
      if (id) {
        let attachment = window.wp.media.attachment(id)
        attachment.fetch()
        if (attachment) {
          selection.add([ attachment ])
        }
      }
    })
    notificationsStorage.trigger('portalChange', '.media-frame')
  }

  onMediaClose () {
    notificationsStorage.trigger('portalChange', null)
  }

  getUrlHtml (key) {
    let urlHtml = ''
    const show = this.state.extraAttributes.url
    if (show) {
      let urlValue = this.state.value.urls[ key ].link || ''
      urlHtml = (
        <Url
          value={urlValue}
          updater={this.handleUrlChange.bind(this, key)}
          api={this.props.api}
          fieldKey={`${this.props.fieldKey}.linkUrl`}
        />
      )
    }
    return urlHtml
  }

  onSortEnd ({ oldIndex, newIndex }) {
    let prevState = Object.assign({}, this.state.value)
    let sortedValue = {}
    sortedValue.urls = arrayMove(prevState.urls, oldIndex, newIndex)
    sortedValue.ids = arrayMove(prevState.ids, oldIndex, newIndex)
    this.setFieldValue(sortedValue)
  }

  customDynamicRender (dynamicApi) {
    if (!dynamicApi.state.isDynamic) {
      return dynamicApi.props.children
    }

    const { dynamicFieldOpened } = dynamicApi.state
    if (dynamicFieldOpened) {
      return dynamicApi.renderDynamicInputs()
    }

    return (
      <div className={dynamicApi.props.attachImageClassNames}>
        {dynamicApi.props.attachImageComponent}
        {dynamicApi.renderOpenButton()}
      </div>
    )
  }

  render () {
    const { options } = this.props
    let { value, filter = false } = this.state
    let useDragHandle = true
    let cookElement = this.props.elementAccessPoint.cook()
    let metaAssetsPath = cookElement.get('metaAssetsPath')
    let filterControl = (
      <div className='vcv-ui-form-attach-image-filter-toggle'>
        <Toggle value={filter} fieldKey={`enableFilter_${this.props.fieldKey}`} updater={this.toggleFilter}
          options={{ labelText: 'Enable Instagram-like filters' }} />
      </div>
    )
    let filterList = filter ? (
      <FilterList
        handleFilterChange={this.handleFilterChange}
        images={value}
        metaAssetsPath={metaAssetsPath}
      />
    ) : ''

    if (!options.imageFilter || (value && value.urls && value.urls.length < 1)) {
      filterControl = ''
      filterList = ''
    }

    const isDynamic = env('VCV_JS_FT_DYNAMIC_FIELDS') && options && options.dynamicField
    let fieldClassNames = classNames({
      'vcv-ui-form-attach-image': true,
      'vcv-ui-form-field-dynamic': isDynamic
    })
    const dragClass = 'vcv-ui-form-attach-image-item--dragging'
    let fieldComponent = <SortableList
      {...this.props}
      metaAssetsPath={metaAssetsPath}
      helperClass={dragClass}
      useDragHandle={useDragHandle}
      onSortEnd={this.onSortEnd}
      axis='xy'
      value={value}
      openLibrary={this.openLibrary}
      handleRemove={this.handleRemove}
      getUrlHtml={this.getUrlHtml}
    />

    return (
      <React.Fragment>
        <DynamicAttribute {...this.props} setFieldValue={this.setFieldValue} value={value} attachImageClassNames={fieldClassNames} attachImageComponent={fieldComponent} render={this.customDynamicRender.bind(this)}>
          <div className={fieldClassNames}>
            {fieldComponent}
          </div>
        </DynamicAttribute>
        {filterControl}
        {filterList}
      </React.Fragment>
    )
  }
}
