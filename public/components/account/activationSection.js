import React from 'react'
import LoadingScreen from './loadingScreen'
import ActivateLicenseScreen from './activateLicenseScreen'
import PostUpdater from './postUpdate'
import OopsScreenController from './oopsScreenController'
import ThankYouScreen from './thankYouScreen'
import { log as logError, send as sendErrorReport } from './logger'
import { getResponse } from '../../tools/response'
import VideoScreen from './videoScreen'
import { getService } from 'vc-cake'
import ActivationSurvey from './activationSurvey'

const $ = window.jQuery
const ActivationSectionContext = React.createContext()
const dataManager = getService('dataManager')
const dataProcessor = getService('dataProcessor')

export default class ActivationSectionProvider extends React.Component {
  static localizations = dataManager.get('localizations')
  static texts = {
    sendingErrorReport: ActivationSectionProvider.localizations ? ActivationSectionProvider.localizations.sendingErrorReport : 'Sending Error Report',
    doNotCloseWhileSendingErrorReportText: ActivationSectionProvider.localizations ? ActivationSectionProvider.localizations.doNotCloseWhileSendingErrorReportText : 'Don’t close this window while sending error is in progress.'
  }

  doUpdatePostAction = async (postUpdater) => {
    const { postUpdateActions, activePostUpdate } = this.state
    const postData = postUpdateActions[activePostUpdate]
    const posts = postUpdateActions

    let ready = false
    const to = window.setTimeout(() => {
      this.setState({ showSkipPostButton: true })
    }, 60 * 1000)

    try {
      await postUpdater.update(postData)
      ready = true
    } catch (e) {
      logError('Failed Update Post', {
        code: 'doAction-updatePosts-1',
        codeNum: '000003',
        action: postUpdateActions,
        postData: postData,
        error: e
      })

      this.setError({
        errorAction: this.doPostUpdate,
        errorReportAction: this.sendErrorReport
      })
      console.warn(e)
    }
    window.clearTimeout(to)
    this.setState({ showSkipPostButton: false })

    if (ready === false) {
      return
    }

    if (activePostUpdate + 1 < posts.length) {
      this.setState({ activePostUpdate: activePostUpdate + 1 })
      return this.doUpdatePostAction(postUpdater)
    } else {
      this.doneActions()
    }
  }

  constructor (props) {
    super(props)

    const updateActions = dataManager.get('updateActions')
    const assetsActions = updateActions && updateActions.actions
    const postUpdateActions = updateActions && updateActions.posts
    const isLoadingFinished = !assetsActions.length && !postUpdateActions.length
    const activePage = dataManager.get('slug')

    ActivationSectionProvider.shouldDoUpdate = activePage === 'vcv-update' || activePage === 'vcv-update-fe'

    this.state = {
      activePage: activePage,
      assetsActions: assetsActions,
      postUpdateActions: postUpdateActions,
      activeAssetsAction: 0,
      activePostUpdate: 0,
      error: null,
      showSkipPostButton: false,
      assetsActionsDone: !assetsActions.length,
      postUpdateDone: !postUpdateActions.length,
      actionsStarted: ActivationSectionProvider.shouldDoUpdate,
      isLoadingFinished: isLoadingFinished,
      sendingErrorReport: false,
      errorReported: false,
      loadingText: null,
      loadingDescription: null,
      showSurvey: window.vcvActivationSurveyUserReasonToUse === false,
      surveyIsLoading: false
    }

    this.doAction = this.doAction.bind(this)
    this.doneActions = this.doneActions.bind(this)
    this.doPostUpdate = this.doPostUpdate.bind(this)
    this.doUpdatePostAction = this.doUpdatePostAction.bind(this)
    this.setError = this.setError.bind(this)
    this.sendErrorReport = this.sendErrorReport.bind(this)
    this.sendErrorCallback = this.sendErrorCallback.bind(this)
    this.handleCloseSurvey = this.handleCloseSurvey.bind(this)
    this.handleSubmitSurvey = this.handleSubmitSurvey.bind(this)
  }

  componentDidMount () {
    const { isLoadingFinished, assetsActions, postUpdateActions } = this.state
    const { shouldDoUpdate } = ActivationSectionProvider

    if (shouldDoUpdate && !isLoadingFinished) {
      const cnt = assetsActions.length

      if (!cnt) {
        if (postUpdateActions) {
          this.doPostUpdate()
        }
      } else {
        this.doAction()
      }
    }
  }

  doAction () {
    const cnt = this.state.assetsActions.length
    const action = this.state.assetsActions[this.state.activeAssetsAction]
    this.setState({ error: null })

    $.ajax(dataManager.get('updateProcessActionUrl'),
      {
        dataType: 'json',
        data: {
          'vcv-hub-action': action,
          'vcv-nonce': dataManager.get('nonce')
        }
      }
    ).done((json) => {
      if (json && json.status) {
        if (this.state.activeAssetsAction === cnt - 1) {
          this.setState({ assetsActionsDone: true })
          if (this.state.postUpdateActions && this.state.postUpdateActions.length) {
            this.doPostUpdate()
          } else {
            this.doneActions()
          }
        } else {
          this.setState({ activeAssetsAction: this.state.activeAssetsAction + 1 })
          this.doAction()
        }
      } else {
        logError('Failed Update Action', {
          code: 'doAction-1',
          codeNum: '000004',
          action: action,
          error: json
        })

        this.setError({
          message: json && json.message ? json.message : '',
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
      }
    }).fail((jqxhr, textStatus, error) => {
      logError('Failed Update Action', {
        code: 'doAction-2',
        codeNum: '000005',
        action: action,
        jqxhr: jqxhr,
        textStatus: textStatus,
        error: error
      })

      try {
        const responseJson = JSON.parse(jqxhr.responseText ? jqxhr.responseText : '""')
        this.setError({
          message: responseJson && responseJson.message ? responseJson.message : '',
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
      } catch (e) {
        const Str = jqxhr.responseText
        try {
          const json = getResponse(Str)
          if (json && json.status) {
            if (this.state.activeAssetsAction === cnt - 1) {
              this.setState({ assetsActionsDone: true })
              if (this.state.postUpdateActions && this.state.postUpdateActions.length) {
                this.doPostUpdate()
              } else {
                this.doneActions()
              }
            } else {
              this.setState({ activeAssetsAction: this.state.activeAssetsAction + 1 })
              this.doAction()
            }
            return
          }
        } catch (pe) {
          console.warn('Actions failed', pe, jqxhr.responseText)
        }
        this.setError({
          errorAction: this.doAction,
          errorReportAction: this.sendErrorReport
        })
        console.warn('Update action failed', e, jqxhr.responseText)
      }
    })
  }

  doPostUpdate () {
    const postUpdater = new PostUpdater(dataManager.get('updateGlobalVariablesUrl'), dataManager.get('updateVendorUrl'), dataManager.get('updateWPBundleUrl'))
    this.setState({ error: null })
    return this.doUpdatePostAction(postUpdater)
  }

  doneActions () {
    this.setState({
      postUpdateDone: true,
      isLoadingFinished: true
    })
  }

  redirect () {
    window.location.reload()
  }

  getActiveScreen () {
    const { activePage } = this.state
    const { shouldDoUpdate } = ActivationSectionProvider

    if (this.state.error) {
      return <OopsScreenController />
    }

    if (this.state.sendingErrorReport) {
      return <LoadingScreen />
    }

    if (this.state.errorReported) {
      return <ThankYouScreen />
    }

    const hasManageOptions = dataManager.get('manageOptions')
    const licenseType = dataManager.get('licenseType')

    if (shouldDoUpdate) {
      if (this.state.isLoadingFinished) {
        this.redirect()
      } else {
        return <LoadingScreen />
      }
    } else if (!hasManageOptions) {
      return <VideoScreen licenseType={licenseType} />
    } else if (activePage === 'vcv-activate-license' || activePage === 'vcv-about' || activePage === 'vcv-license-options') {
      return <ActivateLicenseScreen licenseType={licenseType} />
    } else if (activePage === 'vcv-getting-started') {
      return <VideoScreen licenseType={licenseType} />
    }
  }

  sendErrorCallback () {
    this.setState({
      sendingErrorReport: false,
      errorReported: true
    })
  }

  sendErrorReport (e) {
    this.setState({
      error: null,
      sendingErrorReport: true,
      loadingText: ActivationSectionProvider.texts.sendingErrorReport,
      loadingDescription: ActivationSectionProvider.texts.doNotCloseWhileSendingErrorReportText
    })
    sendErrorReport(e, this.sendErrorCallback)
  }

  setError (errorData) { // message, errorAction, errorReportAction
    this.setState({
      error: {
        ...errorData,
        errorName: 'activation'
      }
    })
  }

  handleSubmitSurvey (userReasonUse) {
    this.setState({ surveyIsLoading: true })
    dataProcessor.appAdminServerRequest({
      'vcv-action': 'license:activation:survey:adminNonce',
      'vcv-plugin-user-reason-use': userReasonUse,
      'vcv-nonce': dataManager.get('nonce')
    }).then(() => {
      this.setState({ surveyIsLoading: false })
      this.handleClosePopup()
    })
  }

  handleClosePopup () {
    this.setState({
      showSurvey: false
    })
  }

  handleCloseSurvey () {
    this.handleClosePopup()
  }

  render () {
    return (
      <ActivationSectionContext.Provider
        value={{
          ...this.state
        }}
      >
        <ActivationSurvey show={this.state.showSurvey} onClose={this.handleCloseSurvey} onSubmitSurvey={this.handleSubmitSurvey} isLoading={this.state.surveyIsLoading} />
        <div className='vcv-activation-section'>
          {this.getActiveScreen()}
        </div>
      </ActivationSectionContext.Provider>
    )
  }
}

export const ActivationSectionConsumer = ActivationSectionContext.Consumer
