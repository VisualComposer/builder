import vcCake from 'vc-cake'
const settingsStorage = vcCake.getStorage('settings')

const postData = {
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
    return window.vcvPostData.status === 'publish' || window.vcvPostData.status === 'private' || window.vcvPostData.status === 'future'
  },

  permalink: () => {
    return settingsStorage.state('permalink').get() || window.vcvPostData.permalink
  },

  previewUrl: () => {
    return settingsStorage.state('previewUrl').get() || window.vcvPostData.previewUrl
  },

  isViewable: () => {
    return window.vcvPostData.viewable
  },

  viewText: () => {
    return window.vcvPostData.viewText
  },

  backendEditorUrl: () => {
    return window.vcvPostData.backendEditorUrl
  },

  adminDashboardUrl: () => {
    return window.vcvPostData.adminDashboardUrl
  },

  vcvCustomPostType: () => {
    return window.vcvPostData.vcvCustomPostType
  },

  adminDashboardPostTypeListUrl: () => {
    return window.vcvPostData.adminDashboardPostTypeListUrl
  }
}

vcCake.addService('wordpress-post-data', postData)
