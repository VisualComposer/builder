import vcCake from 'vc-cake'

let postData = {
  canPublish: () => {
    return window.vcvPostData.canPublish
  },

  isDraft: () => {
    return (
      window.vcvPostData.status !== 'publish' &&
      window.vcvPostData.status !== 'future' &&
      window.vcvPostData.status !== 'pending' &&
      window.vcvPostData.status !== 'private'
    )
  },

  isPublished: () => {
    return window.vcvPostData.status === 'publish'
  },

  permalink: () => {
    return window.vcvPostData.permalink
  },

  previewUrl: () => {
    return window.vcvPostData.previewUrl
  },

  backendEditorUrl: () => {
    return window.vcvPostData.backendEditorUrl
  },

  adminDashboardUrl: () => {
    return window.vcvPostData.adminDashboardUrl
  }
}

vcCake.addService('wordpress-post-data', postData)
