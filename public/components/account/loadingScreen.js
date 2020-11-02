import React from 'react'
import { ActivationSectionConsumer } from './activationSection'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class LoadingScreen extends React.Component {
  static localizations = dataManager.get('localizations')
  static texts = {
    downloadingAssetsText: LoadingScreen.localizations ? LoadingScreen.localizations.downloadingAssets : 'Downloading assets {i} of {cnt}: {name}',
    downloadingInitialExtensionsText: LoadingScreen.localizations ? LoadingScreen.localizations.downloadingInitialExtensions : 'Downloading initial extensions',
    savingResultsText: LoadingScreen.localizations ? LoadingScreen.localizations.savingResults : 'Saving Results',
    postUpdateText: LoadingScreen.localizations ? LoadingScreen.localizations.postUpdateText : 'Update posts {i} in {cnt}: {name}',
    doNotCloseWhileUpdateText: LoadingScreen.localizations ? LoadingScreen.localizations.doNotCloseWhileUpdateText : 'Don’t close this window while the download is in progress.',
    skipThisPostText: LoadingScreen.localizations ? LoadingScreen.localizations.skipThisPostText : 'Skip this post'
  }

  constructor (props) {
    super(props)
    this.activationContent = React.createRef()
  }

  componentDidMount () {
    setTimeout(() => {
      this.activationContent.current && this.activationContent.current.classList.add('vcv-activation-content--active')
    }, 0)
  }

  getDownloadText (data) {
    const { assetsActions, activeAssetsAction, postUpdateActions, activePostUpdate, assetsActionsDone, postUpdateDone, actionsStarted } = data

    if (!actionsStarted) {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.downloadingInitialExtensionsText}</p>
    }

    // Show default actions if they are not finished
    if (!assetsActionsDone) {
      const activeActionData = assetsActions[activeAssetsAction]
      const loadingText = LoadingScreen.texts.downloadingAssetsText.replace('{i}', activeAssetsAction + 1).replace('{cnt}', assetsActions.length).replace('{name}', activeActionData.name)
      return <p className='vcv-activation-loading-text'>{loadingText}</p>
    }

    // Show default actions if they are not finished
    if (!postUpdateDone) {
      const activePostUpdateData = postUpdateActions[activePostUpdate]
      const loadingText = LoadingScreen.texts.postUpdateText.replace('{i}', activePostUpdate + 1).replace('{cnt}', postUpdateActions.length).replace('{name}', activePostUpdateData.name || 'No name')
      return <p className='vcv-activation-loading-text'>{loadingText}</p>
    }

    if (assetsActionsDone && postUpdateDone) {
      return <p className='vcv-activation-loading-text'>{LoadingScreen.texts.savingResultsText}</p>
    }
  }

  static handleClickSkipPostUpdate () {
    const rebuildPostSkipPost = dataManager.get('rebuildPostSkipPost')
    const sourceID = dataManager.get('sourceID')
    rebuildPostSkipPost && sourceID && rebuildPostSkipPost(sourceID)
  }

  render () {
    return (
      <ActivationSectionConsumer>
        {({ assetsActions, postUpdateActions, activeAssetsAction, activePostUpdate, showSkipPostButton, assetsActionsDone, postUpdateDone, actionsStarted, loadingText, loadingDescription }) => (
          <div className='vcv-activation-loading-screen vcv-activation-content' ref={this.activationContent}>
            <div id='vcv-posts-update-wrapper' />
            <div className='vcv-loading-dots-container'>
              <div className='vcv-loading-dot vcv-loading-dot-1' />
              <div className='vcv-loading-dot vcv-loading-dot-2' />
            </div>
            {loadingText ? <p className='vcv-activation-loading-text'>{loadingText}</p> : this.getDownloadText({ assetsActions, postUpdateActions, activeAssetsAction, activePostUpdate, assetsActionsDone, postUpdateDone, actionsStarted })}
            <p className='vcv-activation-loading-helper-text'>
              {loadingDescription || LoadingScreen.texts.doNotCloseWhileUpdateText}
            </p>
            {showSkipPostButton && (
              <div className='vcv-activation-button-container'>
                <button onClick={LoadingScreen.handleClickSkipPostUpdate} className='vcv-activation-button'>Skip this post</button>
              </div>
            )}
          </div>
        )}
      </ActivationSectionConsumer>
    )
  }
}
