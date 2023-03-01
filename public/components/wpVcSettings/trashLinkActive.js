import vcCake from 'vc-cake'

export function trashLinkActive () {
  const iframe = document.getElementsByClassName('vcv-dashboard-section-custom-post-type-iframe')
  if (!iframe[0]) {
    return
  }

  iframe[0].onload = function () {
    const innerDoc = iframe[0].contentDocument || iframe[0].contentWindow.document
    const trashLinkList = innerDoc.getElementsByClassName('submitdelete')
    const postType = innerDoc.querySelector('#posts-filter .post_type_page').value

    for (const trashLink of trashLinkList) {
      const postId = trashLink.closest('.iedit').querySelector('.check-column input').value

      if (!postId) {
        continue
      }

      const row = trashLink.closest('.iedit').querySelector('.row-title')
      if (!row) {
        continue
      }
      const postTitle = row.textContent

      trashLink.addEventListener('click', function (event) {
        event.preventDefault()

        const dataProcessor = vcCake.getService('dataProcessor')
        const dataManager = vcCake.getService('dataManager')
        const localizations = dataManager.get('localizations')

        const iframeLoader = document.querySelector('.vcv-dashboard-iframe-loader-wrapper')

        iframeLoader.classList.add('vcv-dashboard-iframe-loader--visible')

        dataProcessor.appServerRequest({
          'vcv-action': 'wordpress:settings:process:plugin:post:type:' + postType + ':trash:adminNonce',
          'vcv-source-id': postId,
          'vcv-nonce': dataManager.get('nonce')
        }).then((data) => {
          iframeLoader.classList.remove('vcv-dashboard-iframe-loader--visible')

          try {
            const jsonData = JSON.parse(data)
            const deleteSeems = localizations ? localizations.removePluginPostTypeLinkFoundPost : 'It seems that'
            const deleteActive = localizations ? localizations.removePluginPostTypeLinkActiveOn : 'is activate on:'

            if (jsonData.status) {
              let postList = '<h3>' + deleteSeems + ' "' + postTitle + '" ' + deleteActive + ' </h3>'

              postList += '<ul>'
              for (const post of jsonData.vcvPostList) {
                postList += '<li>' + post.post_title + ' (#' + post.ID + ')' + '</li>'
              }
              postList += '</ul>'

              const modalHtml = getModalHtml(postList, event.target.getAttribute('href'))
              const dashboardContent = document.querySelector('.vcv-dashboards-section-content')

              dashboardContent.insertAdjacentHTML('beforebegin', modalHtml)

              const closeButton = document.querySelector('.vcv-activation-survey.vcv-trash-post .vcv-ui-icon-close')
              const submitButton = document.querySelector('.vcv-activation-survey.vcv-trash-post .survey-submit')

              closeButton.addEventListener('click', function () {
                const modal = document.querySelector('.vcv-activation-survey.vcv-trash-post')
                modal.remove()
              })

              submitButton.addEventListener('click', function () {
                window.location = event.target.getAttribute('href')
                const modal = document.querySelector('.vcv-activation-survey.vcv-trash-post')
                modal.remove()
              })
            } else {
              window.location = event.target.getAttribute('href')
            }
          } catch (e) {
            window.location = event.target.getAttribute('href')
          }
        })
      })
    }
  }
}

function getModalHtml (postList) {
  const dataManager = vcCake.getService('dataManager')
  const localizations = dataManager.get('localizations')

  const deleteConfirm = localizations ? localizations.removePluginPostTypeLinkConfirmation : 'Do you really want to delete'
  const submit = localizations ? localizations.submit : 'Submit'

  const html =
    '<div class="vcv-activation-survey vcv-trash-post">' +
      '<div class="vcv-ui-modal-overlay" data-modal="true">' +
        '<div class="vcv-ui-modal-container">' +
          '<div class="vcv-ui-modal">' +
            '<span class="vcv-ui-modal-close" title="Close"><i class="vcv-ui-modal-close-icon vcv-ui-icon vcv-ui-icon-close"></i></span>' +
            '<h1 class="vcv-ui-modal-header-title">' + deleteConfirm + '</h1>' +
            '<section class="vcv-ui-modal-content">' + postList + '</section>' +
            '<footer class="vcv-ui-modal-footer"><button class="survey-submit">' + submit + '</button></footer>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'

  return html
}
