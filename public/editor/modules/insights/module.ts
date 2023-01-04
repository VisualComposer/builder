import { getStorage, env, add } from 'vc-cake'
import { debounce } from 'lodash'
import InsightsChecks from './lib/InsightsChecks'
import store from 'public/editor/stores/store'
import { insightsReset } from 'public/editor/stores/insights/slice'

const historyStorage = getStorage('history')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')

add('insights', () => {
  if (typeof (window as any).vcvRebuildPostSave !== 'undefined') {
    return
  }
  if (env('VCV_FT_INSIGHTS')) {
    const insightsChecksInstance = new InsightsChecks()
    const runChecksCallback = debounce(() => {
      const iframeDomNode = document.querySelector<HTMLIFrameElement>('.vcv-layout-iframe')
      if (!iframeDomNode || !iframeDomNode.contentWindow) {
        return // editor reload
      }
      // clear previous <Insights>
      store.dispatch(insightsReset())
      insightsChecksInstance.isImagesSizeLarge = false

      // Do all checks
      const isEmptyContent: boolean = insightsChecksInstance.checkForEmptyContent()
      if (!isEmptyContent) {
        insightsChecksInstance.checkForHeadings()
        insightsChecksInstance.checkForAlt()
        insightsChecksInstance.checkNameForLinks()
        insightsChecksInstance.checkForImagesSize()
        insightsChecksInstance.checkParagraphsLength()
        insightsChecksInstance.checkTitleLength()
        insightsChecksInstance.checkNoIndex()
        insightsChecksInstance.checkPostContentLength()
        insightsChecksInstance.checkForGA()
        insightsChecksInstance.checkLinks()
        insightsChecksInstance.contrast()
      }
    }, 5000)
    historyStorage.on('init add undo redo', runChecksCallback)
    settingsStorage.state('pageTitleDisabled').onChange(runChecksCallback)
    settingsStorage.state('pageTitle').onChange(runChecksCallback)
    workspaceStorage.state('iframe').onChange(({ type }: { type: string }) => {
      if (type === 'loaded') {
        runChecksCallback()
      }
    })
    elementsStorage.on('elementsRenderDone', runChecksCallback)
  }
})
