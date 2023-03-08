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

        dataProcessor.appAdminServerRequest({
          'vcv-action': 'wordpress:settings:process:plugin:post:type:' + postType + ':trash:adminNonce',
          'vcv-source-id': postId,
          'vcv-nonce': dataManager.get('nonce')
        }).then((data) => {
          iframeLoader.classList.remove('vcv-dashboard-iframe-loader--visible')

          try {
            const jsonData = JSON.parse(data)

            let modalHtml = ''
            if (jsonData.status) {
              const deleteSeems = localizations ? localizations.removePluginPostTypeLinkFoundPost : 'It seems that'

              let modalContent = ''
              if (jsonData.vcvPostList) {
                const deleteActive = localizations ? localizations.removePluginPostTypeLinkActiveOn : 'is activate on:'

                modalContent += '<p class="vcv-ui-modal-text">' + deleteSeems + ' "<span class="vcv-ui-modal-text-page-name">' + postTitle + '</span>" ' + deleteActive + ' </p>'

                modalContent += '<ul class="vcv-ui-modal-list">'

                for (const [postId, postTitle] of Object.entries(jsonData.vcvPostList)) {
                  modalContent += '<li class="vcv-ui-modal-list-item">' + postTitle + ' (#' + postId + ')' + '</li>'
                }
                modalContent += '</ul>'
              }

              if (jsonData.vcvGlobalSettingsList) {
                modalContent += '<ul class="vcv-ui-modal-list">'
                const globalPluginOption = localizations ? localizations.globalPluginOption : 'plugin option'

                for (const settingName of Object.values(jsonData.vcvGlobalSettingsList)) {
                  modalContent += '<li class="vcv-ui-modal-list-item">' + settingName + ' (#' + globalPluginOption + ')' + '</li>'
                }
                modalContent += '</ul>'
              }

              modalHtml = getModalHtml(modalContent)

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
        }, (error) => {
          window.location = event.target.getAttribute('href')
          console.warn('Failed to get the popup HTML', error)
        })
      })
    }
  }
}

function getModalHtml (postList) {
  const dataManager = vcCake.getService('dataManager')
  const localizations = dataManager.get('localizations')

  const deleteConfirm = localizations ? localizations.removePluginPostTypeLinkConfirmation : 'Are you sure you want to proceed?'
  const submit = localizations ? localizations.proceed : 'Yes, proceed'

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
