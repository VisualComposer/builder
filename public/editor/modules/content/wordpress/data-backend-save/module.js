import vcCake from 'vc-cake'
import DataController from './lib/dataController'

vcCake.add('contentWordpressDataBackendSave', (api) => {
  return new DataController({ api: api })
})
