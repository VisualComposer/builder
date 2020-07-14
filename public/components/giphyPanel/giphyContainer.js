import React from 'react'
import unsplashLogo from 'public/sources/images/giphyLogo.raw'
import classNames from 'classnames'
import GiphyResultsPanel from './giphyResultsPanel'
import PropTypes from 'prop-types'

export default class GiphyContainer extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static propTypes = {
    scrolledToBottom: PropTypes.bool,
    scrollTop: PropTypes.number
  }

  inputTimeout = 0

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      input: false,
      searchValue: '',
      isSearchUsed: false
    }
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentWillUnmount () {
    if (this.inputTimeout) {
      window.clearTimeout(this.inputTimeout)
      this.inputTimeout = 0
    }
  }

  static handleClickGoPremium (e) {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    window.location.replace(target.dataset.href)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.handleSearch()
    }
  }

  handleSearch () {
    const newState = {
      searchValue: this.state.inputValue
    }
    if (this.state.inputValue) {
      newState.isSearchUsed = true
    }
    this.setState(newState)
  }

  handleValueChange (e) {
    this.setState({
      inputValue: e.currentTarget.value
    })
  }

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  getSearch () {
    const searchPhotosOnUnsplash = GiphyContainer.localizations ? GiphyContainer.localizations.searchPhotosOnUnsplash : 'Search free high-resolution photos on Unsplash'
    const inputContainerClasses = classNames({
      'vcv-ui-search-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    const autoFocus = true

    return (
      <div className={inputContainerClasses}>
        <button className='vcv-ui-search-button' onClick={this.handleSearch}>
          <i className='vcv-ui-icon vcv-ui-icon-search' />
        </button>
        <input
          className='vcv-ui-form-input vcv-ui-search-field'
          onChange={this.handleValueChange}
          onFocus={this.handleInputFocus}
          type='text'
          value={this.state.inputValue}
          placeholder={searchPhotosOnUnsplash}
          onKeyPress={this.handleKeyPress}
          autoFocus={autoFocus}
        />
      </div>
    )
  }

  render () {
    const getPhotosWithPremiumText = 'Download and Add Free Animated Giphies to Your Site With Visual Composer Premium'
    const getPhotosText = 'Download and Add Free Animated Giphies to Your Site'
    const activatePremium = GiphyContainer.localizations ? GiphyContainer.localizations.activatePremium : 'Activate Premium'

    let content = ''
    if (typeof window.vcvIsPremiumActivated !== 'undefined' && !window.vcvIsPremiumActivated) {
      content = (
        <>
          <span className='vcv-stock-images-unsplash-logo' dangerouslySetInnerHTML={{ __html: unsplashLogo }} />
          <p className='vcv-stock-images-subtitle'>{getPhotosWithPremiumText}</p>
          <span className='vcv-stock-images-button' data-href={window.vcvUpgradeUrlUnsplash} onClick={GiphyContainer.handleClickGoPremium}>
            {activatePremium}
          </span>
        </>
      )
    } else {
      content = (
        <>
          <span className='vcv-stock-images-unsplash-logo' dangerouslySetInnerHTML={{ __html: unsplashLogo }} />
          <p className='vcv-stock-images-subtitle'>{getPhotosText}</p>
          {this.getSearch()}
        </>
      )
    }

    const style = {}
    if (!this.state.isSearchUsed) {
      style.backgroundColor = '#251b1b'
    }

    const stockImageContainerClasses = classNames({
      'vcv-ui-editor-plates-container': true,
      'vcv-ui-editor-plate--stock-images': true,
      'vcv-ui-editor-plate--stock-images--search-is-used': this.state.isSearchUsed
    })

    return (
      <>
        <div className={stockImageContainerClasses}>
          <div className='vcv-stock-images-container' style={style}>
            <div className='vcv-stock-images-inner'>
              {content}
            </div>
          </div>
        </div>
        <GiphyResultsPanel
          searchValue={this.state.searchValue}
          scrolledToBottom={this.props.scrolledToBottom}
          scrollTop={this.props.scrollTop}
          isSearchUsed={this.state.isSearchUsed}
        />
      </>
    )
  }
}
