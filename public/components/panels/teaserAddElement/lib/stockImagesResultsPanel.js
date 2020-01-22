import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { getStorage, getService, env } from 'vc-cake'
import classNames from 'classnames'

const dataProcessor = getService('dataProcessor')
const notificationsStorage = getStorage('notifications')
const sharedAssetsLibraryService = getService('sharedAssetsLibrary')

export default class StockImagesResultsPanel extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string,
    scrolledToBottom: PropTypes.bool,
    scrollTop: PropTypes.number,
    isSearchUsed: PropTypes.bool
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()
  maxColumnCount = 5
  abortController = new window.AbortController()
  componentUnmounted = false
  unsplashLicenseKey = (window.VCV_LICENSE_KEY && window.VCV_LICENSE_KEY()) || 'free'
  allowDownload = true

  constructor (props) {
    super(props)
    this.state = {
      columnData: lodash.defaultsDeep({}, this.createDefaultColumnData()),
      total: 0,
      columnCount: this.getColumnCount(),
      page: 1,
      totalPages: 0,
      requestInProgress: false,
      hasError: false,
      activeItem: null,
      downloadingItems: []
    }
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.downloadImage = this.downloadImage.bind(this)
    this.setColumnCount = this.setColumnCount.bind(this)
    this.showDownloadOptions = this.showDownloadOptions.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.setColumnCount)
    this.getImagesFromServer('', 1, 'trending')
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('resize', this.setColumnCount)
    this.componentUnmounted = true
    this.abortController.abort()
  }

  componentDidUpdate (prevProps, prevState) {
    const { requestInProgress, page } = prevState
    const { scrolledToBottom, searchValue, scrollTop } = prevProps

    if (this.props.searchValue) {
      if (this.props.searchValue !== searchValue) {
        this.getImagesFromServer(this.props.searchValue, 1)
      } else if (
        requestInProgress === false &&
        this.props.scrolledToBottom &&
        (this.props.scrolledToBottom !== scrolledToBottom)
      ) {
        this.getImagesFromServer(this.props.searchValue, page)
      }
    }

    if (this.props.scrollTop !== scrollTop) {
      this.showImages()
    }
  }

  prepareImages (imageData) {
    const columnData = this.getColumnData(imageData.results)

    this.setState({
      columnData: columnData,
      total: parseInt(imageData.total),
      page: this.state.page + 1,
      totalPages: parseInt(imageData.totalPages),
      requestInProgress: false
    })

    // check if already existing images fills the container
    if (this.resultContainer) {
      const scrollContainer = this.resultContainer.closest('.vcv-ui-scroll-content')
      const clientRect = scrollContainer && scrollContainer.getBoundingClientRect()
      if (clientRect && clientRect.height >= scrollContainer.scrollHeight) {
        this.getImagesFromServer(this.props.searchValue, this.state.page)
      }
    }
  }

  getColumnData (images) {
    let newData = ''
    if (this.state.page === 1) {
      newData = lodash.defaultsDeep({}, this.createDefaultColumnData())
    } else {
      newData = lodash.defaultsDeep({}, this.state.columnData)
    }
    if (images && images.length) {
      Object.keys(newData).forEach((colCount) => {
        const currentData = newData[colCount]
        images.forEach((image) => {
          const imageProportions = image.height / image.width
          const smallestIndex = this.getSmallestFromArray(currentData)
          currentData[smallestIndex].value += imageProportions
          currentData[smallestIndex].images.push(image)
        })
      })
    }
    return newData
  }

  createDefaultColumnData () {
    const columnData = {}
    for (let colCount = 1; colCount <= this.maxColumnCount; colCount++) {
      columnData[colCount] = []
      for (let i = 0; i < colCount; i++) {
        columnData[colCount].push({ value: 0, images: [] })
      }
    }
    return columnData
  }

  getImagesFromServer (searchValue, page, action = 'search') {
    if (page > 1 && page > this.state.totalPages) {
      return
    }
    const vcvApiUrl = window.VCV_API_URL && window.VCV_API_URL()
    const vcvSiteUrl = window.VCV_SITE_URL && window.VCV_SITE_URL()
    const unsplashUrl = `${vcvApiUrl}/api/unsplash/${action}`
    const unsplashLicenseKey = this.unsplashLicenseKey

    this.setState({
      page: page,
      requestInProgress: true,
      hasError: false
    })

    let url = ''
    if (action === 'search') {
      url = `${unsplashUrl}/${searchValue}?licenseKey=${unsplashLicenseKey}&page=${page}&url=${vcvSiteUrl}`
    } else {
      url = `${unsplashUrl}?licenseKey=${unsplashLicenseKey}&url=${vcvSiteUrl}`
    }

    window.fetch(url, { method: 'get', signal: this.abortController.signal })
      .then(res => res.json())
      .then(
        (result) => {
          if (result) {
            if (Object.prototype.hasOwnProperty.call(result, 'allowDownload')) {
              this.allowDownload = result.allowDownload
            } else {
              this.allowDownload = true
            }
            this.prepareImages(result)
            if (result.results && result.results.length) {
              this.showImages()
            }
          }
        },
        (error) => {
          if (this.componentUnmounted) {
            return
          }
          const errorText = `${StockImagesResultsPanel.localizations.noConnectionToUnsplash} #10088` || 'Could not connect to Unsplash Server! #10088'
          notificationsStorage.trigger('add', {
            position: 'bottom',
            transparent: true,
            rounded: true,
            text: errorText,
            time: 3000,
            type: 'error',
            id: 'unsplash-error'
          })
          this.setState({
            hasError: true
          })
          if (env('VCV_DEBUG')) {
            console.warn(errorText, error)
          }
        }
      )
  }

  getSmallestFromArray (arr) {
    if (arr.length === 1) {
      return 0
    }
    let smallestIndex = 0
    let smallest = arr[0].value
    arr.forEach((item, index) => {
      if (item.value < smallest) {
        smallest = arr[index].value
        smallestIndex = index
      }
    })
    return smallestIndex
  }

  setColumnCount () {
    const colCount = this.getColumnCount()
    if (this.state.columnCount !== colCount) {
      this.setState({ columnCount: colCount })
      this.showImages()
    }

    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    if (windowHeight !== this.windowHeight) {
      this.showImages()
    }
    this.windowHeight = windowHeight
  }

  getColumnCount () {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth
    const step = 250
    let size = 300
    for (let colCount = 1; colCount <= this.maxColumnCount; colCount++) {
      if (windowWidth < size + step) {
        return colCount
      } else {
        size += step
      }
    }
    return this.maxColumnCount
  }

  handleImageLoad (e) {
    const img = e.currentTarget
    if (img) {
      const imgWrapper = img.closest('.vcv-stock-image-wrapper')
      if (imgWrapper) {
        imgWrapper.classList.add('vcv-stock-image--loaded')
      }
    }
  }

  showImages () {
    const images = this.resultContainer && this.resultContainer.querySelectorAll('.vcv-stock-image-not-visible')
    const inAdvance = 100
    if (images && images.length) {
      images.forEach((img) => {
        if ((img.getBoundingClientRect().top - inAdvance) < (window.innerHeight || document.documentElement.clientHeight)) {
          img.src = img.dataset.src
          img.classList.remove('vcv-stock-image-not-visible')
        }
      })
    }
  }

  downloadImage (e) {
    const target = e.currentTarget
    const size = target && target.getAttribute('data-img-size')
    const wrapper = target && target.closest('.vcv-stock-image-inner')
    const imageId = wrapper && wrapper.id
    if (imageId && size) {
      const downloadingItems = this.state.downloadingItems
      downloadingItems[imageId] = true
      this.setState({
        downloadingItems: downloadingItems
      })
      dataProcessor.appServerRequest({
        'vcv-action': 'hub:unsplash:download:adminNonce',
        'vcv-nonce': window.vcvNonce,
        'vcv-imageId': imageId,
        'vcv-imageSize': size
      }).then((data) => {
        try {
          const jsonData = JSON.parse(data)
          if (jsonData.status) {
            notificationsStorage.trigger('add', {
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: StockImagesResultsPanel.localizations.imageDownloadedToMediaLibrary || 'Image has been downloaded to your Media Library.',
              time: 3000
            })
          } else {
            let errorMessage = jsonData.response ? jsonData.response.message : jsonData.message
            errorMessage = errorMessage || `${StockImagesResultsPanel.localizations.noAccessCheckLicence} #10087` || 'No access, please check your license! #10087'
            notificationsStorage.trigger('add', {
              position: 'bottom',
              transparent: true,
              rounded: true,
              text: errorMessage,
              time: 3000,
              type: 'error',
              id: 'unsplash-error'
            })
            if (env('VCV_DEBUG')) {
              console.warn(errorMessage, jsonData)
            }
          }
        } catch (e) {
          const exceptionErrorMessage = `${StockImagesResultsPanel.localizations.coundNotParseData} #10086` || 'Could not parse data from server! #10086'
          notificationsStorage.trigger('add', {
            position: 'bottom',
            transparent: true,
            rounded: true,
            text: exceptionErrorMessage,
            time: 3000,
            type: 'error',
            id: 'unsplash-error'
          })
          if (env('VCV_DEBUG')) {
            console.warn(exceptionErrorMessage, e)
          }
        }
        if (this.componentUnmounted) {
          return
        }
        if (this.state.activeItem === imageId) {
          this.setState({ activeItem: null })
        }
        const downloadingItems1 = this.state.downloadingItems
        delete downloadingItems1[imageId]
        this.setState({
          downloadingItems: downloadingItems1
        })
      })
    }
  }

  showDownloadOptions (e) {
    const clickedElement = e.currentTarget
    const id = clickedElement && clickedElement.parentElement.id

    if (id) {
      window.setTimeout(() => {
        this.setState({ activeItem: id })
        document.addEventListener('click', this.handleClickOutside)
      }, 1)
    }
  }

  handleClickOutside (e) {
    const clickedElement = e.target
    if (!clickedElement.closest('.vcv-stock-image-download-button')) {
      this.setState({ activeItem: null })
      document.removeEventListener('click', this.handleClickOutside)
    }
  }

  getItems () {
    const { columnData, columnCount, activeItem, downloadingItems } = this.state
    const allowDownload = this.allowDownload && this.unsplashLicenseKey !== 'free'
    const unlockText = StockImagesResultsPanel.localizations ? StockImagesResultsPanel.localizations.activatePremiumToUnlockStockImages : 'Activate Premium to Unlock Stock Images'
    return columnData[columnCount].map((col, colIndex) => {
      return (
        <div className='vcv-stock-images-col' key={`vcv-stock-image-column-${columnCount}-${colIndex}`}>
          {col.images.map((image, imageIndex) => {
            const { urls, user } = image
            const props = {
              className: 'vcv-stock-image vcv-stock-image-not-visible',
              alt: 'Unsplash image',
              onLoad: this.handleImageLoad,
              onError: this.handleImageLoad,
              'data-src': urls.small
            }
            const innerItemClasses = classNames({
              'vcv-stock-image-inner': true,
              'vcv-stock-image-inner--active': image.id === activeItem,
              'vcv-stock-image--downloading': downloadingItems[image.id]
            })
            const imageProportions = image.height / image.width
            return <div
              className='vcv-stock-image-wrapper'
              key={`vcv-stock-image-${columnCount}-${colIndex}-${imageIndex}`}
            >
              <div
                className={innerItemClasses}
                style={{ paddingBottom: `${imageProportions * 100}%` }}
                id={image.id}
              >
                <img {...props} />
                {allowDownload
                  ? (<div className='vcv-stock-image-hover-download' onClick={this.showDownloadOptions}>
                    <span className='vcv-ui-icon vcv-ui-icon-download' />
                  </div>)
                  : (<div className='vcv-stock-image-hover-download vcv-stock-image-hover-lock' title={unlockText}>
                    <span className='vcv-ui-icon vcv-ui-icon-lock' />
                  </div>)}

                <a href={user && user.url} target='_blank' className='vcv-stock-image-author'>
                  <img src={user && user.image} alt={user && user.name} className='vcv-stock-image-author-image' />
                  {user && user.name}
                </a>
                {allowDownload
                  ? <>
                    <div className='vcv-stock-image-download-container'>
                      <div className='vcv-stock-image-download-options'>
                        <button
                          className='vcv-stock-image-download-button'
                          onClick={this.downloadImage}
                          data-img-size='400'
                        >
                          {StockImagesResultsPanel.localizations.small || 'Small'}
                          <span> (400 x {Math.round(400 * imageProportions)})</span>
                        </button>
                        <button
                          className='vcv-stock-image-download-button'
                          onClick={this.downloadImage}
                          data-img-size='800'
                        >
                          {StockImagesResultsPanel.localizations.medium || 'Medium'}
                          <span> (800 x {Math.round(800 * imageProportions)})</span>
                        </button>
                        <button
                          className='vcv-stock-image-download-button'
                          onClick={this.downloadImage}
                          data-img-size='1600'
                        >
                          {StockImagesResultsPanel.localizations.large || 'large'}
                          <span> (1600 x {Math.round(1600 * imageProportions)})</span>
                        </button>
                      </div>
                    </div>
                    <div className='vcv-stock-image-loading'>
                      <span className='vcv-ui-icon vcv-ui-wp-spinner-light' />
                    </div>
                  </>
                  : null}
              </div>
            </div>
          })}
        </div>
      )
    })
  }

  getNoResultsElement () {
    const nothingFoundText = StockImagesResultsPanel.localizations ? StockImagesResultsPanel.localizations.nothingFound : 'Nothing found'

    const source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt={nothingFoundText}
        />
      </div>
    </div>
  }

  render () {
    const { total, columnCount, requestInProgress, page, hasError } = this.state
    const { searchValue, isSearchUsed } = this.props
    if (hasError) {
      return null
    }
    if (isSearchUsed && !searchValue) {
      return this.getNoResultsElement()
    }
    const loadingHtml = (
      <div className='vcv-loading-dots-container'>
        <div className='vcv-loading-dot vcv-loading-dot-1' />
        <div className='vcv-loading-dot vcv-loading-dot-2' />
      </div>
    )

    if (requestInProgress && page === 1) {
      return loadingHtml
    }
    const classNames = `vcv-stock-images-results-container vcv-stock-images-column-count--${columnCount}`
    let results = ''
    if (total > 0) {
      results = (
        <div className={classNames} ref={(resultContainer) => { this.resultContainer = resultContainer }}>
          {this.getItems()}
        </div>
      )
    } else {
      results = this.getNoResultsElement()
    }
    const freeText = StockImagesResultsPanel.localizations.free && StockImagesResultsPanel.localizations.free.toLowerCase()
    const pictureText = StockImagesResultsPanel.localizations.images
    const downloadText = StockImagesResultsPanel.localizations.downloadImageFromUnsplash
    return (
      <>
        {searchValue && (
          <div className='vcv-stock-images-results-data'>
            <span>{total} {freeText || 'free'} {searchValue.toLowerCase()} {pictureText || 'images'}</span>
            <span>{downloadText || 'Download images from Unsplash to your Media Library'}</span>
          </div>
        )}
        {results}
        {requestInProgress && (<div className='vcv-loading-wrapper'>{loadingHtml}</div>)}
      </>
    )
  }
}
