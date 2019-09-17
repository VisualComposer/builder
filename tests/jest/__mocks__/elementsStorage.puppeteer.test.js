/* global describe, test, expect, beforeAll, jest, afterAll, process */
import Puppeteer from 'puppeteer'

describe('Edit form dependencies tests', () => {

  const DOMAIN = process.env.DOMAIN || 'https://localhost:8080'
  const WP_USERNAME = process.env.WP_USERNAME || 'admin'
  const WP_PASSWORD = process.env.WP_PASSWORD || 'admin'
  const isHeadless = process.env.IS_HEADLESS === 'true'
  const withDevTools = process.env.DEVTOOLS === 'true'
  let browser
  let page

  const id = '123456'
  const testText = 'This test text, it must work as expected!'

  jest.setTimeout(100000)

  beforeAll(async () => {
    browser = await Puppeteer.launch({ headless: isHeadless, devtools: withDevTools })
    page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 720 })
    await page.goto(`${DOMAIN}/wp-login.php`, { timeout: 0, waitUntil: 'networkidle2' })
    await expect(page).toFillForm('#loginform', {
      log: WP_USERNAME,
      pwd: WP_PASSWORD
    })
    await page.click('#wp-submit')
    await page.waitForNavigation()
    await page.goto(`${DOMAIN}/wp-admin/post-new.php?post_type=page&vcv-action=frontend`, {
      timeout: 0,
      waitUntil: 'networkidle2'
    })

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })
    await page.mainFrame().waitForSelector('[title="Add Element"].vcv-ui-navbar-control')
  })

  test('Element storage add textBlock', async () => {
    const textBlock = await page.mainFrame().evaluate((id) => {
      window.app.getStorage('elements').trigger('add', { tag: 'textBlock', id: id })
      const textBlock = window.app.getService('document').get(id)
      return Promise.resolve(textBlock)
    }, id)
    await expect(textBlock.id).toBe(id)
  })

  test('Elements storage update textBlock text', async () => {
    const textBlock = await page.mainFrame().evaluate((id, testText) => {
      const elementsStorage = window.app.getStorage('elements')
      const cook = window.app.getService('cook')
      const documentService = window.app.getService('document')
      const textBlock = cook.get(documentService.get(id))
      textBlock.set('output', testText)
      elementsStorage.trigger('update', id, textBlock.toJS())
      return Promise.resolve(documentService.get(id))
    }, id, testText)
    expect(textBlock.output).toBe(testText)
  })

  test('Elements storage clone textBlock', async () => {
    const textBlocksLength = await page.mainFrame().evaluate((id) => {
      const elementsStorage = window.app.getStorage('elements')
      const documentService = window.app.getService('document')
      elementsStorage.trigger('clone', id)
      return Promise.resolve(documentService.filter((data) => {
        return data.get('tag') === 'textBlock'
      }).length)
    }, id)
    expect(textBlocksLength).toBe(2)
  })
  test('Elements storage remove textBlock', async () => {
    const textBlocksLength = await page.mainFrame().evaluate((id) => {
      const elementsStorage = window.app.getStorage('elements')
      const documentService = window.app.getService('document')
      elementsStorage.trigger('remove', id)
      return Promise.resolve(documentService.filter((data) => {
        return data.get('tag') === 'textBlock'
      }).length)
    }, id)
    expect(textBlocksLength).toBe(1)
  })
  afterAll(async () => {
    await browser.close()
  })
})
