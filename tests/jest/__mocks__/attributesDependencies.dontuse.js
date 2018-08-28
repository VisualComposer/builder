/* global describe, test, expect, beforeAll, jest, afterAll, process */
import Puppeteer from 'puppeteer'

describe('Test attributes dependencies', () => {
  const DOMAIN = process.env.DOMAIN || 'https://www.visualcomposer.io'
  const WP_USERNAME = process.env.WP_USERNAME || 'admin'
  const WP_PASSWORD = process.env.WP_PASSWORD || 'admin'

  let browser
  let page

  jest.setTimeout(100000)

  const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  beforeAll(async () => {
    browser = await Puppeteer.launch({ headless: true, devtools: false })
    page = await browser.newPage()
  })
  test('Add button and enable custom hover colors', async () => {
    // await page.setViewport({ width: 1200, height: 720 })
    await page.goto(`${DOMAIN}/wp-login.php`, { timeout: 0, waitUntil: 'networkidle2' })
    await page.type('#user_login', WP_USERNAME)
    await page.type('#user_pass', WP_PASSWORD)
    await page.click('#wp-submit')
    await page.waitForNavigation()
    await page.goto(`${DOMAIN}/wp-admin/post-new.php?post_type=page&vcv-action=frontend`, { timeout: 0, waitUntil: 'networkidle2' })
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight)
    })
    // await timeout(5000)

    await page.mainFrame().waitForSelector('[title="Add Element"].vcv-ui-navbar-control', { timeout: 0 })
    await timeout(5000) // Find the way to remove it
    // await browser.close()
    await expect(page).toClick('[title="Add Element"].vcv-ui-navbar-control')
    await expect(page).toClick('[title="Basic Button"].vcv-ui-item-element')
  })
  afterAll(async () => {
    await browser.close()
  })
})
