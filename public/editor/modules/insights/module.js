import { getStorage, getService, env, add } from 'vc-cake'
import { debounce, memoize } from 'lodash'

const insightsStorage = getStorage('insights')
const historyStorage = getStorage('history')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const cookService = getService('cook')
const utils = getService('utils')
const dataManager = getService('dataManager')

add('insights', () => {
  // VC: Insights
  class InsightsChecks {
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
        for (let i = 0; i < headings.length; i++) {
          const heading = headings[i]
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
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'titleLength',
          title: insightsTitleTooLong,
          groupDescription: insightsTitleTooLong100
        })
      } else if (pageTitleLength > 61) {
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'titleLength',
          title: insightsTitleTooLong,
          groupDescription: insightsTitleTooLong60
        })
      } else if (pageTitleLength > 9) {
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'titleLength',
          title: insightsTitleGood,
          groupDescription: `Your page title consists of ${pageTitleLength} characters which is optimal title size.`
        })
      } else if (pageTitleLength >= 0) {
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'titleLength',
          title: insightsTitleTooShort,
          groupDescription: insightsTitleTooShortDescription
        })
      }
    }

    checkNoIndex () {
      const noIndexMetaTag = this.localizations.noIndexMetaTag
      const noIndexMetaTagDescription = this.localizations.noIndexMetaTagDescription

      const metas = document.querySelector('.vcv-layout-iframe').contentWindow.document.querySelectorAll('meta')
      metas.forEach((meta) => {
        if (meta.content.includes('noindex')) {
          insightsStorage.trigger('add', {
            state: 'warning',
            type: 'noIndex',
            title: noIndexMetaTag,
            groupDescription: noIndexMetaTagDescription
          })
        }
      })
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
      links.forEach((link) => {
        if (window.location.host === link.host) {
          inboundLinks.push(link)
        } else {
          outboundLinks.push(link)
        }
      })

      if (!inboundLinks.length) {
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'noInboundLinks',
          title: noInboundLinks,
          groupDescription: noInboundLinksDescription
        })
      }

      if (!outboundLinks.length) {
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'noOutboundLinks',
          title: noOutboundLinks,
          groupDescription: noOutboundLinksDescription
        })
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
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noH1',
          title: h1MissingTitle,
          groupDescription: h1MissingDescription
        })
      } else if (visibleHeadings === 1) {
        const insightsH1ExistsTitle = this.localizations.insightsH1ExistsTitle
        const insightsH1ExistsDescription = this.localizations.insightsH1ExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'existH1',
          title: insightsH1ExistsTitle,
          groupDescription: insightsH1ExistsDescription
        })
      } else {
        const insightsMultipleH1Title = this.localizations.insightsMultipleH1Title
        const insightsMultipleH1Description = this.localizations.insightsMultipleH1Description
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'multipleH1',
          title: insightsMultipleH1Title,
          groupDescription: insightsMultipleH1Description
        })
      }
    }

    checkForEmptyContent () {
      const elements = getStorage('elements').state('document').get() || []
      if (!elements.length) {
        // There are no elements on a page
        insightsStorage.trigger('add', {
          state: 'critical',
          type: 'noElementsOnPage',
          title: this.localizations.insightsNoContentOnPageTitle,
          groupDescription: this.localizations.insightsNoContentOnPageDescription
        })
        return true
      }
      return false
    }

    checkForAlt () {
      const images = env('iframe').document.body.querySelectorAll('img')
      let allImagesHasAlt = true
      images.forEach((image) => {
        if (!image.alt || image.alt === '') {
          const altMissingTitle = this.localizations.insightsImageAltAttributeMissingTitle
          const description = this.localizations.insightsImageAltAttributeMissingDescription
          const elementId = InsightsChecks.getElementId(image)
          const position = InsightsChecks.getNodePosition(image)
          allImagesHasAlt = false
          insightsStorage.trigger('add', {
            state: 'critical',
            type: `altMissing${position}`,
            thumbnail: image.src,
            title: position !== 'Content' ? `${position}: ${altMissingTitle}` : altMissingTitle,
            groupDescription: description,
            description: 'Alt attribute is empty %s'.replace('%s', elementId ? `(${cookService.getById(elementId).getName()})` : '').trim(),
            elementID: elementId,
            domNode: image
          })
        }
      })
      if (images.length && allImagesHasAlt) {
        const altExistsTitle = this.localizations.insightsImageAltAttributeExistsTitle
        const altExistsDescription = this.localizations.insightsImageAltAttributeExistsDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'altExists',
          title: altExistsTitle,
          groupDescription: altExistsDescription
        })
      }
    }

    checkForImageSize () {
      const images = env('iframe').document.body.querySelectorAll('img')
      const promises = []
      images.forEach((image) => {
        // Skip checking for our images
        if (image.src.indexOf('cdn.hub.visualcomposer.com') === -1) {
          promises.push(this.getImageSize(image.src, image))
        }
      })
      return promises
    }

    checkForBgImageSize () {
      function getBgImgs (doc) {
        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
        return Array.from(
          // Remove .mce-tinymce, script, style from checking bg image
          Array.from(doc.querySelectorAll('body > *:not(.mce-tinymce, script, style) *:not(script, style), body')).reduce((collection, node) => {
            const prop = window.getComputedStyle(node, null)
              .getPropertyValue('background-image')
            const match = srcChecker.exec(prop)
            if (match) {
              collection.add({ src: match[1], domNode: node })
            }
            return collection
          }, new Set())
        )
      }

      const bgImages = getBgImgs(env('iframe').document)
      const promises = []
      bgImages.forEach((data) => {
        promises.push(this.getImageSize(data.src, data.domNode, 'background'))
      })
      return promises
    }

    async checkForImagesSize () {
      const promises = this.checkForImageSize()
      promises.concat(this.checkForBgImageSize())
      await Promise.all(promises)

      if (promises.length && !this.isImagesSizeLarge) {
        const imageSizeProperTitle = this.localizations.insightsImagesSizeProperTitle
        const imageSizeProperDescription = this.localizations.insightsImagesSizeProperDescription
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'imgSizeProper',
          title: imageSizeProperTitle,
          groupDescription: imageSizeProperDescription
        })
      }
    }

    async getImageSize (src, domNode, type = '') {
      const imageSizeBytes = await InsightsChecks.getImageSizeRequest(src)
      if (imageSizeBytes && imageSizeBytes >= 1024 * 1024) {
        const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
        let description = this.localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        const imageSizeInMB = imageSizeBytes / 1024 / 1024
        description = description.replace('%s', '1 MB')
        this.isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'critical',
          type: `imgSize1MB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: 'Image size is' + ` ${imageSizeInMB.toFixed(2)} MB`,
          elementID: elementId,
          domNode: domNode
        })
      } else if (imageSizeBytes && imageSizeBytes >= 500 * 1024) {
        const imageSizeBigTitle = type === 'background' ? this.localizations.insightsBgImageSizeBigTitle : this.localizations.insightsImageSizeBigTitle
        let description = this.localizations.insightsImageSizeBigDescription
        const position = InsightsChecks.getNodePosition(domNode)
        const elementId = InsightsChecks.getElementId(domNode)
        description = description.replace('%s', '500 KB')
        this.isImagesSizeLarge = true
        insightsStorage.trigger('add', {
          state: 'warning',
          type: `imgSize500KB${position}`,
          thumbnail: src,
          title: position !== 'Content' ? `${position}: ${imageSizeBigTitle}` : imageSizeBigTitle,
          groupDescription: description,
          description: 'Image size is' + ` ${parseInt(imageSizeBytes / 1024)} KB`,
          elementID: elementId,
          domNode: domNode
        })
      }
    }

    static getImageSizeRequest = memoize((imageUrl) => {
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
            resolve(xhr.getResponseHeader('Content-Length'))
          }
        }
        xhr.onerror = function (error) {
          reject(new Error(`Wrong network response received:${error}`))
        }
        xhr.send(null)
      })
    })

    static getElementId (domNode) {
      if (domNode.hasAttribute('data-vcv-element')) {
        return domNode.getAttribute('data-vcv-element')
      } else {
        const closestParent = domNode.closest('[data-vcv-element]')
        return closestParent ? closestParent.getAttribute('data-vcv-element') : false
      }
    }

    static getNodePosition (domNode) {
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
    }

    checkParagraphsLength () {
      const paragraphs = env('iframe').document.body.querySelectorAll('.vcv-layouts-html p')
      let isParagraphSizeLarge = false

      paragraphs.forEach((paragraph) => {
        const paragraphLength = paragraph.innerText.split(' ').length
        if (paragraph.length && paragraphLength > 200) {
          const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
          const groupDescription = this.localizations.insightsParagraphLengthDescription200
          const description = this.localizations.insightsParagraphLengthDescription
          const elementId = InsightsChecks.getElementId(paragraph)
          const position = InsightsChecks.getNodePosition(paragraph)
          isParagraphSizeLarge = true
          insightsStorage.trigger('add', {
            state: 'critical',
            type: `paragraphLengthLarge${position}`,
            title: position !== 'Content' ? `${position}: ${insightsParagraphLengthTitle}` : insightsParagraphLengthTitle,
            groupDescription: groupDescription,
            description: `${description} ${paragraphLength}`,
            elementID: elementId,
            domNode: paragraph
          })
        } else if (paragraph.length && paragraphLength > 150 && paragraphLength < 200) {
          const elementId = InsightsChecks.getElementId(paragraph)
          const position = InsightsChecks.getNodePosition(paragraph)
          const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
          const groupDescription = this.localizations.insightsParagraphLengthDescription150
          const description = this.localizations.insightsParagraphLengthDescription
          isParagraphSizeLarge = true
          insightsStorage.trigger('add', {
            state: 'warning',
            type: `paragraphLengthMedium${position}`,
            title: position !== 'Content' ? `${position}: ${insightsParagraphLengthTitle}` : insightsParagraphLengthTitle,
            groupDescription: groupDescription,
            description: `${description} ${paragraphLength}`,
            elementID: elementId,
            domNode: paragraph
          })
        }
      })

      if (paragraphs.length && !isParagraphSizeLarge) {
        const insightsParagraphLengthTitle = this.localizations.insightsParagraphLengthTitle
        const groupDescription = this.localizations.insightsParagraphLengthDescriptionOk
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'paragraphSizeProper',
          title: insightsParagraphLengthTitle,
          groupDescription: groupDescription
        })
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
          insightsStorage.trigger('add', {
            state: 'critical',
            type: 'contentSize300',
            title: insightsParagraphLengthTitle,
            groupDescription: groupDescription.replace('%length', contentLength)
          })
        } else if (layoutHTML) {
          groupDescription = this.localizations.insightsContentLengthDescriptionOk
          insightsStorage.trigger('add', {
            state: 'success',
            type: 'contentSizeProper',
            title: insightsParagraphLengthTitle,
            groupDescription: groupDescription.replace('%length', contentLength)
          })
        }
      }
    }

    checkForGA () {
      const gaNodes = env('iframe').document.querySelectorAll('script[src*="googletagmanager.com"], script[src*="google-analytics.com"]')
      if (!window.dataLayer && !window.GoogleAnalyticsObject && !window.ga && !gaNodes.length) {
        const insightsGAMissingTitle = this.localizations.insightsGAMissingTitle
        const insightsGAMissingDescription = this.localizations.insightsGAMissingDescription
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'googleAnalytics',
          title: insightsGAMissingTitle,
          groupDescription: insightsGAMissingDescription
        })
      } else {
        const insightsGAMissingTitleOK = this.localizations.insightsGAMissingTitleOK
        const insightsGAMissingDescriptionOK = this.localizations.insightsGAMissingDescriptionOK
        insightsStorage.trigger('add', {
          state: 'success',
          type: 'googleAnalytics',
          title: insightsGAMissingTitleOK,
          groupDescription: insightsGAMissingDescriptionOK
        })
      }
    }

    contrast (insightsStorageInstance) {
      const workspaceStorageState = workspaceStorage.state('content').get()
      const triggerCheckContrast = () => {
        insightsStorage.trigger('remove', 'colorContrast')
        insightsStorage.trigger('add', {
          state: 'warning',
          type: 'colorContrast',
          title: this.localizations.contrastRatio,
          groupDescription: this.localizations.contrastCheckInProgress,
          loading: true
        })
        insightsStorageInstance.checkContrast()
        this.isColorContrastInProgress = true
      }

      if (workspaceStorageState === 'messages' && !this.isColorContrastInProgress) {
        triggerCheckContrast()
      }

      workspaceStorage.state('content').onChange(debounce((value) => {
        if (value === 'messages' && !this.isColorContrastInProgress) {
            triggerCheckContrast()
        }
      }), 250)
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
        iframe.axe
          .run(
            '#vcv-editor',
            {
              resultTypes: ['violations'],
              xpath: true,
              runOnly: 'color-contrast'
            }
          )
          .then(results => {
            const { violations } = results
            const colorContrast = violations.find(violation => violation.id === 'color-contrast')
            if (colorContrast) {
              const notificationItems = []
              colorContrast.nodes.forEach((node, i) => {
                let itemMessage = node.any[0].message
                itemMessage = itemMessage.slice(0, itemMessage.indexOf('Expected'))
                const idStartIndex = node.xpath[0].indexOf('el-')
                if (idStartIndex > -1) {
                  const idLength = 11
                  const idSelector = node.xpath[0].slice(idStartIndex, idStartIndex + idLength)
                  let elementID = idSelector.slice(3)
                  let cookElement = cookService.getById(elementID)
                  const domNode = iframe.document.querySelector(`#${idSelector}`)
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
                        groupDescription: this.localizations.colorContrastDescriptionWarn,
                        description: itemMessage,
                        elementID: elementID,
                        domNode: domNode,
                        groupedItems: true
                      })
                    }
                  }
                }
              })
              insightsStorage.trigger('remove', 'colorContrast')
              notificationItems.reverse().forEach(item => insightsStorage.trigger('add', item))
            } else {
              insightsStorage.trigger('remove', 'colorContrast')
              insightsStorage.trigger('add', {
                state: 'success',
                type: 'colorContrast',
                title: this.localizations.colorContrastTitleOK,
                groupDescription: this.localizations.colorContrastDescriptionOK
              })
            }
            this.isColorContrastInProgress = false
          })
          .catch(err => {
            console.error('An error occurred on axe.run():', err)
          })
      }
    }
  }

  if (env('VCV_FT_INSIGHTS')) {
    const insightsStorageInstance = new InsightsChecks()
    const runChecksCallback = debounce(() => {
      if (!document.querySelector('.vcv-layout-iframe') || !document.querySelector('.vcv-layout-iframe').contentWindow) {
        return // editor reload
      }
      // clear previous <Insights>
      insightsStorage.trigger('reset')
      insightsStorageInstance.isImagesSizeLarge = false

      // Do all checks
      const isEmptyContent = insightsStorageInstance.checkForEmptyContent()
      if (!isEmptyContent) {
        insightsStorageInstance.checkForHeadings()
        insightsStorageInstance.checkForAlt()
        insightsStorageInstance.checkForImagesSize()
        insightsStorageInstance.checkParagraphsLength()
        insightsStorageInstance.checkTitleLength()
        insightsStorageInstance.checkNoIndex()
        insightsStorageInstance.checkPostContentLength()
        insightsStorageInstance.checkForGA()
        insightsStorageInstance.checkLinks()
        insightsStorageInstance.contrast(insightsStorageInstance)
      }
    }, 5000)
    historyStorage.on('init add undo redo', runChecksCallback)
    settingsStorage.state('pageTitleDisabled').onChange(runChecksCallback)
    settingsStorage.state('pageTitle').onChange(runChecksCallback)
    workspaceStorage.state('iframe').onChange(({ type }) => {
      if (type === 'loaded') {
        runChecksCallback()
      }
    })
    elementsStorage.on('elementsRenderDone', runChecksCallback)
  }
})
