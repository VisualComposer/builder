import vcCake from 'vc-cake'
const settingsStorage = vcCake.getStorage('settings')
const dataManager = vcCake.getService('dataManager')

const postData = {
  canPublish: () => {
    return dataManager.get('postData').canPublish
  },

  isDraft: () => {
    return (
      dataManager.get('postData').status !== 'publish' &&
      dataManager.get('postData').status !== 'future' &&
      dataManager.get('postData').status !== 'pending' &&
      dataManager.get('postData').status !== 'private'
    )
  },

  isPublished: () => {
    const { status } = dataManager.get('postData')
    return ['publish', 'private', 'future'].includes(status)
  },

  permalink: () => {
    return settingsStorage.state('permalink').get() || dataManager.get('postData').permalink
  },

  previewUrl: () => {
    return settingsStorage.state('previewUrl').get() || dataManager.get('postData').previewUrl
  },

  isViewable: () => {
    return dataManager.get('postData').viewable
  },

  viewText: () => {
    return dataManager.get('postData').viewText
  },

  backendEditorUrl: () => {
    return dataManager.get('postData').backendEditorUrl
  },

  adminDashboardUrl: () => {
    return dataManager.get('postData').adminDashboardUrl
  },

  vcvCustomPostType: () => {
    return dataManager.get('postData').vcvCustomPostType
  },

  adminDashboardPostTypeListUrl: () => {
    return dataManager.get('postData').adminDashboardPostTypeListUrl
  }
}

vcCake.addService('wordpress-post-data', postData)
