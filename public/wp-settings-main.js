import './editor/modules/backendSettings/activation-intro'
import './editor/modules/backendSettings/activation'
import './editor/modules/backendSettings/deactivation'
import './sources/less/wpsettings/init.less'
// import './resources/account/wrapper' // uncomment this and comment 4 lines above to make it work correctly
// import './sources/less/wpsettings-update/init.less' // uncomment this also

window.jQuery(() => {
  let $ = window.jQuery
  let installationUrl = 'https://visualcomposer.io/article/installation/'
  let faqUrl = 'https://visualcomposer.io/article/faq/'
  let descriptionSection = $('#section-description')
  let showDescription = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setTimeout(() => {
      descriptionSection.show()
    }, 100)
    $('<a>').attr('href', e.currentTarget.href).attr('target', '_blank')[0].click()
  }
  $('[name*="Installation"]').attr('href', installationUrl).attr('target', '_blank').click(showDescription)
  $('[name*="FAQ"]').attr('href', faqUrl).attr('target', '_blank').click(showDescription)
})
