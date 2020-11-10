import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

const API = {
  all: () => {
    return dataManager.get('hubGetGroups')
  }
}

vcCake.addService('hubGroups', API)
