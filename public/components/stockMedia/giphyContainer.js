import React from 'react'
import StockMedia from './stockMedia'
import PropTypes from 'prop-types'
import giphyLogo from 'public/sources/images/giphyLogo.raw'

export default class GiphyContainer extends React.Component {
  static propTypes = {
    scrolledToBottom: PropTypes.bool,
    scrollTop: PropTypes.number
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const stockMediaLocalizations = {
      searchText: localizations ? localizations.discoverGifAnimationsText : 'Discover best GIF animations from Giphy',
      getMediaText: localizations ? localizations.getGiphiesText : 'Download and Add Free Animated Giphies to Your Site',
      getMediaWithPremiumText: localizations ? localizations.getGiphiesWithPremiumText : 'Download and Add Free Animated Giphies to Your Site With Visual Composer Premium',
      noConnectionToStockMediaText: `${localizations.noConnectionToGiphy} #10088` || 'Could not connect to Giphy Server! #10088',
      downloadText: localizations ? localizations.downloadAnimationsFromGiphy : 'Download animations from Giphy to your Media Library',
      unlockText: localizations ? localizations.activatePremiumToUnlockGiphy : 'Activate Premium to Unlock Giphy Integration',
      searchResultKey: localizations ? localizations.GifAnimations : 'GIF animations'
    }

    return (
      <StockMedia
        stockMediaLogo={giphyLogo}
        backgroundImage='#251b1b'
        stockMediaLocalizations={stockMediaLocalizations}
        upgradeUrl={window.vcvUpgradeUrlUnsplash}
        vcvAuthorApiKey={window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY && window.VCV_LICENSE_UNSPLASH_AUTHOR_API_KEY()}
        apiUrlKey='giphy'
        {...this.props}
      />
    )
  }
}
