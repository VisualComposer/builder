import { env, getService, getStorage } from 'vc-cake'
import { debounce, memoize } from 'lodash'
import { AxePlugin, AxeResults, NodeResult } from '../axe'
import store from 'public/editor/stores/store'
import { insightsAdded, insightsRemoved } from 'public/editor/stores/insights/slice'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const cookService = getService('cook')
const utils = getService('utils')
const dataManager = getService('dataManager')

export default class InsightsChecks {
  constructor () {
    this.applyColorBox = this.applyColorBox.bind(this)
  }

  isImagesSizeLarge = false
  isColorContrastInProgress = false
  localizations = dataManager.get('localizations')

  checkTitleLength () {
    if (dataManager.get('editorType') !== 'default') {
      return
    }

    let pageTitleLength = settingsStorage.state('pageTitle').get().length
    if (settingsStorage.state('pageTitleDisabled').get()) {
      const headings = env('iframe').document.body.querySelectorAll('h1')
      for (const heading of headings) {
        if (heading.offsetParent !== null && heading.getBoundingClientRect().height) {
          pageTitleLength = heading.innerText.length
          break
        }
      }
    }

    const insightsTitleTooLong = this.localizations.insightsTitleTooLong
    const insightsTitleTooLong60 = this.localizations.insightsTitleTooLong60
    const insightsTitleTooLong100 = this.localizations.insightsTitleTooLong100
    const insightsTitleTooShort = this.localizations.insightsTitleTooShort
    const insightsTitleTooShortDescription = this.localizations.insightsTitleTooShortDescription
    const insightsTitleGood = this.localizations.insightsTitleGood

    if (pageTitleLength > 100) {
      store.dispatch(insightsAdded({
        state: 'critical',
        type: 'titleLength',
        title: insightsTitleTooLong,
        groupDescription: insightsTitleTooLong100
      }))
    } else if (pageTitleLength > 61) {
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'titleLength',
        title: insightsTitleTooLong,
        groupDescription: insightsTitleTooLong60
      }))
    } else if (pageTitleLength > 9) {
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'titleLength',
        title: insightsTitleGood,
        groupDescription: `Your page title consists of ${pageTitleLength} characters which is optimal title size.`
      }))
    } else if (pageTitleLength >= 0) {
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'titleLength',
        title: insightsTitleTooShort,
        groupDescription: insightsTitleTooShortDescription
      }))
    }
  }

  checkNoIndex () {
    const noIndexMetaTag = this.localizations.noIndexMetaTag
    const noIndexMetaTagDescription = this.localizations.noIndexMetaTagDescription

    const metas = document.querySelector<HTMLIFrameElement>('.vcv-layout-iframe')?.contentWindow?.document.querySelectorAll('meta')
    if (metas && metas.length) {
      metas.forEach((meta) => {
        if (meta.content.includes('noindex')) {
          store.dispatch(insightsAdded({
            state: 'warning',
            type: 'noIndex',
            title: noIndexMetaTag,
            groupDescription: noIndexMetaTagDescription
          }))
        }
      })
    }
  }

  checkLinks () {
    const inboundLinks = []
    const outboundLinks = []

    const noInboundLinks = this.localizations.noInboundLinks
    const noInboundLinksDescription = this.localizations.noInboundLinksDescription
    const noOutboundLinks = this.localizations.noOutboundLinks
    const noOutboundLinksDescription = this.localizations.noOutboundLinksDescription

    const contentRoot = env('iframe').document.getElementById('vcv-editor')
    const links = contentRoot.querySelectorAll('a')
    links.forEach((link: HTMLAnchorElement) => {
      if (window.location.host === link.host) {
        inboundLinks.push(link)
      } else {
        outboundLinks.push(link)
      }
    })

    if (!inboundLinks.length) {
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'noInboundLinks',
        title: noInboundLinks,
        groupDescription: noInboundLinksDescription
      }))
    }

    if (!outboundLinks.length) {
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'noOutboundLinks',
        title: noOutboundLinks,
        groupDescription: noOutboundLinksDescription
      }))
    }
  }

  checkForHeadings () {
    if (dataManager.get('editorType') !== 'default') {
      return
    }
    const headings = env('iframe').document.body.querySelectorAll('h1')
    let visibleHeadings = 0
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      if (heading.offsetParent !== null && heading.getBoundingClientRect().height) {
        visibleHeadings++
      }
    }
    if (visibleHeadings === 0) {
      const h1MissingTitle = this.localizations.insightsH1MissingTitle
      const h1MissingDescription = this.localizations.insightsH1MissingDescription
      store.dispatch(insightsAdded({
        state: 'critical',
        type: 'noH1',
        title: h1MissingTitle,
        groupDescription: h1MissingDescription
      }))
    } else if (visibleHeadings === 1) {
      const insightsH1ExistsTitle = this.localizations.insightsH1ExistsTitle
      const insightsH1ExistsDescription = this.localizations.insightsH1ExistsDescription
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'existH1',
        title: insightsH1ExistsTitle,
        groupDescription: insightsH1ExistsDescription
      }))
    } else {
      const insightsMultipleH1Title = this.localizations.insightsMultipleH1Title
      const insightsMultipleH1Description = this.localizations.insightsMultipleH1Description
      store.dispatch(insightsAdded({
        state: 'critical',
        type: 'multipleH1',
        title: insightsMultipleH1Title,
        groupDescription: insightsMultipleH1Description
      }))
    }
  }

  checkForEmptyContent () {
    const elements = getStorage('elements').state('document').get() || []
    if (!elements.length) {
      // There are no elements on a page
      store.dispatch(insightsAdded({
        state: 'critical',
        type: 'noElementsOnPage',
        title: this.localizations.insightsNoContentOnPageTitle,
        groupDescription: this.localizations.insightsNoContentOnPageDescription
      }))
      return true
    }
    return false
  }

  checkForAlt () {
    const images = env('iframe').document.body.querySelectorAll('img')
    let allImagesHasAlt = true
    images.forEach((image: HTMLImageElement) => {
      if ((!image.alt || image.alt === '') && !image.classList.contains('vce-lb-image')) {
        const altMissingTitle = this.localizations.insightsImageAltAttributeMissingTitle
        const description = this.localizations.insightsImageAltAttributeMissingDescription
        const elementId = InsightsChecks.getElementId(image)
        const position = InsightsChecks.getNodePosition(image)
        allImagesHasAlt = false
        const domNodeSelector = utils.generateQuerySelector(image)
        store.dispatch(insightsAdded({
          state: 'critical',
          type: `altMissing${position}`,
          thumbnail: image.src,
          title: position !== 'Content' ? `${position}: ${altMissingTitle}` : altMissingTitle,
          groupDescription: description,
          description: 'Alt attribute is empty %s'.replace('%s', elementId ? `(${cookService.getById(elementId).getName()})` : '').trim(),
          elementID: elementId,
          domNodeSelector: domNodeSelector
        }))
      }
    })
    if (images.length && allImagesHasAlt) {
      const altExistsTitle = this.localizations.insightsImageAltAttributeExistsTitle
      const altExistsDescription = this.localizations.insightsImageAltAttributeExistsDescription
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'altExists',
        title: altExistsTitle,
        groupDescription: altExistsDescription
      }))
    }
  }

  checkForImageSize () {
    const images = env('iframe').document.body.querySelectorAll('img')
    const promises: Promise<void>[] = []
    images.forEach((image: HTMLImageElement) => {
      const domNodeSelector = utils.generateQuerySelector(image)
      // Skip checking for our images
      if (image.src.indexOf('cdn.hub.visualcomposer.com') === -1) {
        promises.push(this.getImageSize(image.src, image, '', domNodeSelector))
      }
    })
    return promises
  }

  checkForBgImageSize () {
    type BgImage = {
      src: string,
      domNodeSelector: string,
      domNode: HTMLElement
    }

    function getBgImages (doc: Document): BgImage[] {
      const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
      return Array.from(
        // Remove .mce-tinymce, script, style from checking bg image
        Array.from(doc.querySelectorAll('body > *:not(.mce-tinymce, script, style) *:not(script, style), body')).reduce((collection, node) => {
          const prop = window.getComputedStyle(node, null)
            .getPropertyValue('background-image')
          const match = srcChecker.exec(prop)
          const domNodeSelector = utils.generateQuerySelector(node)
          if (match) {
            collection.add({ src: match[1], domNode: node, domNodeSelector: domNodeSelector })
          }
          return collection
        }, new Set())
      ) as BgImage[]
    }

    const bgImages: BgImage[] = getBgImages(env('iframe').document)
    const promises: Promise<void>[] = []
    bgImages.forEach((data: BgImage) => {
      promises.push(this.getImageSize(data.src, data.domNode, 'background', data.domNodeSelector))
    })

    return promises
  }

  async checkForImagesSize () {
    let promises = this.checkForImageSize()
    promises = promises.concat(this.checkForBgImageSize())
    await Promise.all(promises)

    if (promises.length && !this.isImagesSizeLarge) {
      const imageSizeProperTitle = this.localizations.insightsImagesSizeProperTitle
      const imageSizeProperDescription = this.localizations.insightsImagesSizeProperDescription
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'imgSizeProper',
        title: imageSizeProperTitle,
        groupDescription: imageSizeProperDescription
      }))
    }
  }

  async getImageSize (src: string, domNode: HTMLElement, type = '', domNodeSelector: string) {
    const imageSizeBytes: number = await InsightsChecks.getImageSizeRequest(src)
    if (imageSizeBytes && imageSizeBytes >= 1024 * 1024) {
      const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
      let description = this.localizations.insightsImageSizeBigDescription
      const position = InsightsChecks.getNodePosition(domNode)
      const elementId = InsightsChecks.getElementId(domNode)
      const imageSizeInMB = imageSizeBytes / 1024 / 1024
      description = description.replace('%s', '1 MB')
      this.isImagesSizeLarge = true
      store.dispatch(insightsAdded({
        state: 'critical',
        type: `imgSize1MB${position}`,
        thumbnail: src,
        title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
        groupDescription: description,
        description: 'Image size is' + ` ${imageSizeInMB.toFixed(1)} MB`,
        elementID: elementId,
        domNodeSelector: domNodeSelector
      }))
    } else if (imageSizeBytes && imageSizeBytes >= 500 * 1024) {
      const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
      let description = this.localizations.insightsImageSizeBigDescription
      const position = InsightsChecks.getNodePosition(domNode)
      const elementId = InsightsChecks.getElementId(domNode)
      description = description.replace('%s', '500 KB')
      this.isImagesSizeLarge = true
      store.dispatch(insightsAdded({
        state: 'warning',
        type: `imgSize500KB${position}`,
        thumbnail: src,
        title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
        groupDescription: description,
        description: 'Image size is' + ` ${(imageSizeBytes / 1024).toFixed(1)} KB`,
        elementID: elementId,
        domNodeSelector: domNodeSelector
      }))
    }
  }

  static getImageSizeRequest = memoize((imageUrl): Promise<number> => {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest()
      xhr.open('HEAD', imageUrl, true)
      xhr.onload = function () {
        if (!(this.status >= 200 && this.status < 300)) {
          reject(new Error(`Wrong network status received: ${this.status} ${imageUrl}`))
        }
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(parseInt(xhr.getResponseHeader('Content-Length') || '0'))
        }
      }
      xhr.onerror = function (error) {
        reject(new Error(`Wrong network response received:${error}`))
      }
      xhr.send(null)
    })
  })

  static getElementId (domNode: HTMLElement): string | null {
    if (domNode.hasAttribute('data-vcv-element')) {
      return domNode.getAttribute('data-vcv-element')
    } else {
      const closestParent = domNode.closest('[data-vcv-element]')
      return closestParent ? closestParent.getAttribute('data-vcv-element') : null
    }
  }

  static getNodePosition (domNode: HTMLElement): string | null {
    const contentRoot = env('iframe').document.getElementById('vcv-editor')
    const documentPosition = domNode.compareDocumentPosition(contentRoot)
    if (documentPosition & window.Node.DOCUMENT_POSITION_CONTAINS) {
      return 'Content'
    } else if (documentPosition & window.Node.DOCUMENT_POSITION_FOLLOWING) {
      // Left Sidebar
      return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Left Sidebar' : 'Header'
    } else if (documentPosition & window.Node.DOCUMENT_POSITION_PRECEDING) {
      // Right Sidebar
      return domNode.closest('[data-vcv-layout-zone="sidebar"]') ? 'Right Sidebar' : 'Footer'
    }

    return null
  }

  checkParagraphsLength () {
    const paragraphs = env('iframe').document.body.querySelectorAll('.vcv-layouts-html p')
    let isParagraphSizeLarge = false

    paragraphs.forEach((paragraph: HTMLElement) => {
      const paragraphLength = paragraph.innerText.split(' ').length
      const domNodeSelector = utils.generateQuerySelector(paragraph)
      if (paragraphLength > 200) {
        const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
        const groupDescription = this.localizations.insightsParagraphLengthDescription200
        const description = this.localizations.insightsParagraphLengthDescription
        const elementId = InsightsChecks.getElementId(paragraph)
        const position = InsightsChecks.getNodePosition(paragraph)
        isParagraphSizeLarge = true
        store.dispatch(insightsAdded({
          state: 'critical',
          type: `paragraphLengthLarge${position}`,
          title: position !== 'Content' ? `${position}: ${insightsParagraphLengthTitle}` : insightsParagraphLengthTitle,
          groupDescription: groupDescription,
          description: `${description} ${paragraphLength}`,
          elementID: elementId,
          domNodeSelector: domNodeSelector
        }))
      } else if (paragraphLength > 150 && paragraphLength < 200) {
        const elementId = InsightsChecks.getElementId(paragraph)
        const position = InsightsChecks.getNodePosition(paragraph)
        const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
        const groupDescription = this.localizations.insightsParagraphLengthDescription150
        const description = this.localizations.insightsParagraphLengthDescription
        isParagraphSizeLarge = true
        store.dispatch(insightsAdded({
          state: 'warning',
          type: `paragraphLengthMedium${position}`,
          title: position !== 'Content' ? `${position}: ${insightsParagraphLengthTitle}` : insightsParagraphLengthTitle,
          groupDescription: groupDescription,
          description: `${description} ${paragraphLength}`,
          elementID: elementId,
          domNodeSelector: domNodeSelector
        }))
      }
    })

    if (paragraphs.length && !isParagraphSizeLarge) {
      const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
      const groupDescription = this.localizations.insightsParagraphLengthDescriptionOk
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'paragraphSizeProper',
        title: insightsParagraphLengthTitle,
        groupDescription: groupDescription
      }))
    }
  }

  checkPostContentLength () {
    const elements = getStorage('elements').state('document').get() || []
    if (elements.length) {
      const layoutHTML = env('iframe').document.body.querySelector('.vcv-layouts-html').innerHTML
      const contentLength = utils.getTextContent(layoutHTML).split(/\s+/).length
      const insightsParagraphLengthTitle = this.localizations.insightsContentLengthTitle
      let groupDescription = ''

      if (layoutHTML && contentLength < 300) {
        groupDescription = this.localizations.insightsContentLengthDescription300
        store.dispatch(insightsAdded({
          state: 'critical',
          type: 'contentSize300',
          title: insightsParagraphLengthTitle,
          groupDescription: groupDescription.replace('%length', contentLength)
        }))
      } else if (layoutHTML) {
        groupDescription = this.localizations.insightsContentLengthDescriptionOk
        store.dispatch(insightsAdded({
          state: 'success',
          type: 'contentSizeProper',
          title: insightsParagraphLengthTitle,
          groupDescription: groupDescription.replace('%length', contentLength)
        }))
      }
    }
  }

  checkForGA () {
    const gaNodes = env('iframe').document.querySelectorAll('script[src*="googletagmanager.com"], script[src*="google-analytics.com"]')
    // @ts-ignore
    if (!window.dataLayer && !window.GoogleAnalyticsObject && !window.ga && !gaNodes.length) {
      const insightsGAMissingTitle = this.localizations.insightsGAMissingTitle
      const insightsGAMissingDescription = this.localizations.insightsGAMissingDescription
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'googleAnalytics',
        title: insightsGAMissingTitle,
        groupDescription: insightsGAMissingDescription
      }))
    } else {
      const insightsGAMissingTitleOK = this.localizations.insightsGAMissingTitleOK
      const insightsGAMissingDescriptionOK = this.localizations.insightsGAMissingDescriptionOK
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'googleAnalytics',
        title: insightsGAMissingTitleOK,
        groupDescription: insightsGAMissingDescriptionOK
      }))
    }
  }

  contrast () {
    const triggerCheckContrast = () => {
      store.dispatch(insightsRemoved('colorContrast'))
      store.dispatch(insightsAdded({
        state: 'warning',
        type: 'colorContrast',
        title: this.localizations.contrastRatio,
        groupDescription: this.localizations.contrastCheckInProgress,
        loading: true
      }))
      this.checkContrast()
      this.isColorContrastInProgress = true
    }

    if (!this.isColorContrastInProgress) {
      triggerCheckContrast()
    }

    workspaceStorage.state('content').onChange(debounce(() => {
      if (!this.isColorContrastInProgress) {
        triggerCheckContrast()
      }
    }), 250)
  }

  applyColorBox (message: string, fgColor: string, bgColor: string): string {
    const colorBox = (color: string) => `<div style="background-color: ${color}" class="vcv-color-box"></div>`
    const fgString = 'foreground color: '
    const bgString = 'background color: '
    const foregroundIndex = message.indexOf(fgString) + fgString.length
    const messageWithFgColor = message.slice(0, foregroundIndex) + colorBox(fgColor) + message.slice(foregroundIndex)
    const backgroundIndex = messageWithFgColor.lastIndexOf(bgString) + bgString.length
    return messageWithFgColor.slice(0, backgroundIndex) + colorBox(bgColor) + messageWithFgColor.slice(backgroundIndex)
  }

  checkContrast () {
    const iframe = env('iframe')
    if (!iframe.document.body.querySelector('#vcv-axe-core')) {
      const axeScript = document.createElement('script')
      axeScript.id = 'vcv-axe-core'
      axeScript.src = 'https://cdn.jsdelivr.net/npm/axe-core@4.3.3/axe.min.js'
      iframe.document.body.appendChild(axeScript)
    }

    if (!iframe.axe) {
      // Need to wait for the axe-core script to load
      setTimeout(() => {
        this.checkContrast()
      }, 500)
    } else {
      const axe: AxePlugin = iframe.axe

      const axePromise: Promise<AxeResults> = axe.run(
        '#vcv-editor',
        {
          resultTypes: ['violations'],
          xpath: true,
          runOnly: 'color-contrast'
        }
      )

      axePromise.then(results => {
        const { violations } = results
        const colorContrast = violations.find(violation => violation.id === 'color-contrast')
        if (colorContrast) {
          type NotificationItem = {
            state: string
            type: string
            thumbnail: string
            title: string
            groupDescription: string
            description: string
            elementID: string
            domNodeSelector: string
            groupedItems: boolean
          }
          const notificationItems: NotificationItem[] = []
          colorContrast.nodes.forEach((node: NodeResult) => {
            let itemMessage = node.any[0].message
            itemMessage = itemMessage.slice(0, itemMessage.indexOf('Expected'))
            const data: { fgColor: string, bgColor: string } = node.any[0].data
            itemMessage = this.applyColorBox(itemMessage, data.fgColor, data.bgColor)
            if (!node.xpath) {
              return
            }
            const idStartIndex = node.xpath[0].indexOf('el-')
            if (idStartIndex > -1) {
              const idLength = 11
              const idSelector = node.xpath[0].slice(idStartIndex, idStartIndex + idLength)
              let elementID = idSelector.slice(3)
              let cookElement = cookService.getById(elementID)
              const domNode = iframe.document.querySelector(`#${idSelector}`)
              const domNodeSelector = utils.generateQuerySelector(domNode)
              const isSameElementIndex = notificationItems.findIndex(item => item.elementID === elementID)

              if (!cookElement) {
                const parent = domNode.closest('[data-vcv-element]')
                if (parent) {
                  const parentElementID = parent.getAttribute('data-vcv-element')
                  cookElement = cookService.getById(parentElementID)
                  elementID = parentElementID
                }
              }
              if (cookElement) {
                if (isSameElementIndex > -1) {
                  notificationItems[isSameElementIndex].description += `<br><br>${itemMessage}`
                } else {
                  notificationItems.push({
                    state: 'warning',
                    type: 'colorContrast',
                    thumbnail: cookElement.get('metaThumbnailUrl'),
                    title: this.localizations.colorContrastTitleWarn,
                    groupDescription: this.localizations.colorContrastDescriptionWarn.replace('{link}', 'https://dequeuniversity.com/rules/axe/4.3/color-contrast?application=axeAPI'),
                    description: itemMessage,
                    elementID: elementID,
                    domNodeSelector: domNodeSelector,
                    groupedItems: true
                  })
                }
              }
            }
          })
          store.dispatch(insightsRemoved('colorContrast'))
          const reversedNotifications = notificationItems.reverse()
          reversedNotifications.forEach(item => store.dispatch(insightsAdded(item)))
        } else {
          store.dispatch(insightsRemoved('colorContrast'))
          store.dispatch(insightsAdded({
            state: 'success',
            type: 'colorContrast',
            title: this.localizations.colorContrastTitleOK,
            groupDescription: this.localizations.colorContrastDescriptionOK.replace('{link}', 'https://dequeuniversity.com/rules/axe/4.3/color-contrast?application=axeAPI')
          }))
        }
        this.isColorContrastInProgress = false
      })
        .catch(err => {
          console.error('An error occurred on axe.run():', err)
        })
    }
  }

  checkNameForLinks () {
    const links = env('iframe').document.body.querySelectorAll('a')
    let allLinksHasName = true
    links.forEach((link: HTMLAnchorElement) => {
      if (!link.innerText && !link.getAttribute('aria-label')) {
        let imageHasAlt = false
        const imagesWithAlt = link.querySelectorAll('img[alt]')
        if (imagesWithAlt.length) {
          imagesWithAlt.forEach((img) => {
            if (img.getAttribute('alt')) {
              imageHasAlt = true
            }
          })
          if (!imageHasAlt) {
            allLinksHasName = false
          }
        }
        if (!imageHasAlt) {
          allLinksHasName = false

          const position = InsightsChecks.getNodePosition(link)
          const elementId = InsightsChecks.getElementId(link)
          const domNodeSelector = utils.generateQuerySelector(link)
          const linkMissingName = this.localizations.insightsLinksDoNotHaveName
          const linkMissingNameDescription = this.localizations.insightsLinksDoNotHaveNameDescription
          const insightsLinkDoNotHaveDiscernibleName = this.localizations.insightsLinkDoNotHaveDiscernibleName
          const cookElement = cookService.getById(elementId)

          store.dispatch(insightsAdded({
            state: 'critical',
            type: `linkNameMissing${position}`,
            thumbnail: cookElement?.get('metaThumbnailUrl'),
            title: position !== 'Content' ? `${position}: ${linkMissingName}` : linkMissingName,
            groupDescription: linkMissingNameDescription,
            description: insightsLinkDoNotHaveDiscernibleName.replace('%s', elementId ? `(${cookService.getById(elementId).getName()})` : '').trim(),
            elementID: elementId,
            domNodeSelector: domNodeSelector
          }))
        }
      }
    })
    if (links.length && allLinksHasName) {
      const insightsAllLinksHaveText = this.localizations.insightsAllLinksHaveText
      const insightsAllLinksHaveTextDescription = this.localizations.insightsAllLinksHaveTextDescription
      store.dispatch(insightsAdded({
        state: 'success',
        type: 'linkNameExists',
        title: insightsAllLinksHaveText,
        groupDescription: insightsAllLinksHaveTextDescription
      }))
    }
  }
}
