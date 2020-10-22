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
      searchText: localizations ? localizations.discoverGifAnimationsText : 'Discover the best GIF animations from Giphy.',
      getMediaText: localizations ? localizations.getGiphiesText : 'Download and Add Free Animated GIFs to Your Site',
      getMediaWithPremiumText: localizations ? localizations.getGiphiesWithPremiumText : 'Download and Add Free Animated GIFs to Your Site With Visual Composer Premium',
      noConnectionToStockMediaText: `${localizations.noConnectionToGiphy} #10089` || 'Could not connect to Giphy Server! #10089',
      downloadText: localizations ? localizations.downloadAnimationsFromGiphy : 'Download animations from Giphy to your Media Library',
      unlockText: localizations ? localizations.activatePremiumToUnlockGiphy : 'Activate Premium to Unlock Giphy Integration',
      searchResultKey: localizations ? localizations.gifAnimations : 'GIF animations',
      hasBeenDownloadedText: localizations ? localizations.gifAnimationDownloadedToMediaLibrary : 'GIF animation has been downloaded to your Media Library.',
      poweredByText: (localizations && localizations.poweredBy) ? `${localizations.poweredBy} <a href='https://giphy.com/' target='_blank'>GIPHY</a>` : 'Powered by <a href=\'https://giphy.com/\' target=\'_blank\'>GIPHY</a>'
    }
    const sizes = [
      {
        size: 'small',
        title: localizations ? localizations.small : 'Small'
      },
      {
        size: 'regular',
        title: localizations ? localizations.regular : 'Regular'
      },
      {
        size: 'full',
        title: localizations ? localizations.full : 'Full'
      }
    ]

    return (
      <StockMedia
        stockMediaLogo={giphyLogo}
        stockMediaLocalizations={stockMediaLocalizations}
        upgradeUrl={window.vcvUpgradeUrlGiphy}
        vcvAuthorApiKey={null}
        apiUrlKey='giphy'
        sizes={sizes}
        previewImageSize='regular'
        customContainerClass='vcv-stock-media-container--giphy'
        {...this.props}
      />
    )
  }
}
