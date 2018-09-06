/* global describe, test, expect, beforeAll, jest, afterAll, process */
import Puppeteer from 'puppeteer'

describe('Edit form dependencies tests', () => {
  const DOMAIN = process.env.DOMAIN || 'https://www.visualcomposer.io'
  const WP_USERNAME = process.env.WP_USERNAME || 'admin'
  const WP_PASSWORD = process.env.WP_PASSWORD || 'admin'
  const isHeadless = false
  const withDevTools = false
  let browser
  let page

  jest.setTimeout(30000)

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
    await page.goto(`${DOMAIN}/wp-admin/post-new.php?post_type=page&vcv-action=frontend`, { timeout: 0, waitUntil: 'networkidle2' })

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })
    await page.mainFrame().waitForSelector('[title="Add Element"].vcv-ui-navbar-control')
  })
  test('Add button and enable custom hover colors', async () => {
    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control', {timeout: 30000})
    await expect(page).toClick('[title="Basic Button"].vcv-ui-item-element', {timeout: 30000})

    await page.mainFrame().waitForSelector('#toggleCustomHover_input')

    await expect(page).toClick('#toggleCustomHover_input')
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Title hover color' })
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Background hover color' })
  })
  test('Add Vimeo Player and enable custom size', async () => {
    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control', {timeout: 30000})
    await expect(page).toClick('[title="Vimeo Player"].vcv-ui-item-element', {timeout: 30000})
    await page.mainFrame().waitForSelector('option[value="custom"]', {text: 'Custom size'})
    await page.mainFrame().select('.vcv-ui-edit-form-section-content select.vcv-ui-form-dropdown', 'custom')
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Custom width' })
  })
  test('Add Youtube Player and enable custom size', async () => {
    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control', {timeout: 30000})
    await expect(page).toClick('[title="Youtube Player"].vcv-ui-item-element', {timeout: 30000})
    await page.mainFrame().waitForSelector('option[value="custom"]', {text: 'Custom size'})
    await page.mainFrame().select('.vcv-ui-edit-form-section-content select.vcv-ui-form-dropdown', 'custom')
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Custom width' })
  })
  test('Add Empty Space and enable custom devices', async () => {
    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control', {timeout: 30000})
    await expect(page).toClick('[title="Empty Space"].vcv-ui-item-element', {timeout: 30000})
    await page.mainFrame().waitForSelector('option[value="custom"]', {text: 'Custom size'})
    await page.mainFrame().select('.vcv-ui-edit-form-section-content select.vcv-ui-form-dropdown', 'custom')
    await expect(page).toMatchElement('span.vcv-ui-form-group-heading', { text: 'Height on desktop' })
  })
  afterAll(async () => {
    await browser.close()
  })
})
