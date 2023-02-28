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
      const postTitle = trashLink.closest('.iedit').querySelector('.row-title').textContent

      if (!postId) {
        continue
      }

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
          try {
            const jsonData = JSON.parse(data)

            const deleteConfirm = localizations ? localizations.removePluginPostTypeLinkConfirmation : 'Do you really want to delete'
            const deleteSeems = localizations ? localizations.removePluginPostTypeLinkFoundPost : 'It seems that'
            const deleteActive = localizations ? localizations.removePluginPostTypeLinkActiveOn : 'is activate on'

            if (jsonData.status) {
              let postList = deleteConfirm + ' "' + postTitle + '" \n\n'
              postList += deleteSeems + ' "' + postTitle + '" ' + deleteActive + ' \n\n'
              for (const post of jsonData.vcvPostList) {
                postList += post[0] + '\n'
              }

              const userConfirmation = confirm(postList)

              if (userConfirmation) {
                window.location = event.target.getAttribute('href')
              } else {
                iframeLoader.classList.remove('vcv-dashboard-iframe-loader--visible')
              }
            } else {
              window.location = event.target.getAttribute('href')
              iframeLoader.classList.remove('vcv-dashboard-iframe-loader--visible')
            }
          } catch (e) {
            window.location = event.target.getAttribute('href')
            iframeLoader.classList.remove('vcv-dashboard-iframe-loader--visible')
          }
        })
      })
    }
  }
}
