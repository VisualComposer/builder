/* global describe, test, expect, beforeAll, jest, afterAll, process */
import Puppeteer from 'puppeteer'

describe('End to end editor tests', () => {
  const DOMAIN = process.env.DOMAIN || 'https://www.visualcomposer.io'
  const WP_USERNAME = process.env.WP_USERNAME || 'admin'
  const WP_PASSWORD = process.env.WP_PASSWORD || 'admin'
  const isHeadless = false
  const withDevTools = false
  let browser
  let page

  jest.setTimeout(100000)

  beforeAll(async () => {
    browser = await Puppeteer.launch({ headless: isHeadless, devtools: withDevTools })
    page = await browser.newPage()
  })
  test('Add button and enable custom hover colors', async () => {
    await page.setViewport({ width: 1200, height: 720 })
    await page.goto(`${DOMAIN}/wp-login.php`, { timeout: 0, waitUntil: 'networkidle2' })
    await expect(page).toFillForm('#loginform', {
      log: WP_USERNAME,
      pwd: WP_PASSWORD
    })
    await page.click('#wp-submit')
    await page.waitForNavigation()
    await page.goto(`${DOMAIN}/wp-admin/post-new.php?post_type=page&vcv-action=frontend`, { timeout: 0, waitUntil: 'networkidle2' })

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })

    await page.mainFrame().waitForSelector('[title="Add Element"].vcv-ui-navbar-control', { timeout: 0 })

    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control')
    await expect(page).toClick('[title="Basic Button"].vcv-ui-item-element')

    await page.mainFrame().waitForSelector('#toggleCustomHover_input', { timeout: 0 })

    await expect(page).toClick('#toggleCustomHover_input')
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Title hover color' })
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Background hover color' })
  })
  afterAll(async () => {
    await browser.close()
  })
})
