/* global test */
import { Selector } from 'testcafe'

const DOMAIN = process.env.DOMAIN || 'https://localhost:8080'
const WP_USERNAME = process.env.WP_USERNAME || 'admin'
const WP_PASSWORD = process.env.WP_PASSWORD || 'admin'
const SLUG = process.env.SLUG || 'visual-composer-website-builder'
fixture`VCWB activation test`// declare the fixture
  .page`${DOMAIN}/wp-login.php`

// then create a test and place your code there
test('Login and open plugins page', async t => {
  await t
    .typeText('#user_login', WP_USERNAME)
    .typeText('#user_pass', WP_PASSWORD)
    .click('#wp-submit')
    .navigateTo(`${DOMAIN}/wp-admin/plugins.php`)
  const exists = await Selector(`[data-slug="${SLUG}"] .deactivate a`).exists
  if (exists) {
    await t.click(`[data-slug="${SLUG}"] .deactivate a`)
    await t.click('#vcv-visual-composer-website-builder a.vcv-deactivation-submit-button')
  }
  await t.click(`[data-slug="${SLUG}"] .activate a`)
  await t.navigateTo(`${DOMAIN}/wp-admin/admin.php?page=vcv-settings`)
  const initialReset = await Selector('.vcv-settings-tab-content a').withText('initiate reset')
  await t
    .setNativeDialogHandler(() => true)
    .click(initialReset)
  await t.navigateTo(`${DOMAIN}/wp-admin/admin.php?page=vcv-getting-started`)
  await t.click('.vcv-activation-button-container a.vcv-activation-button.vcv-activation-button--dark')
  const activateFreeButton = await Selector('a.vcv-basic-button.vcv-basic-button--dark.vcv-basic-button--full').withText('ACTIVATE FREE')
  await t.click(activateFreeButton)
  const categorySelect = await Selector('#vcv-account-login-form-category')
  const categoryOption = await categorySelect.find('option')
  await t
    .click(categorySelect)
    .click(categoryOption.withText('Blog'))
    .expect(categorySelect.value).eql('Blog')
  await t
    .typeText('[name="email"]', 'developers@visualcomposer.com')
    .click('#vcv-confirmation')
    .click('[type="submit"]')
  const createNewPage = await Selector('a.vcv-activation-button').withText('CREATE NEW PAGE')
  await t.click(createNewPage)
})
