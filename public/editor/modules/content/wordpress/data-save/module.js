import vcCake from 'vc-cake'
import DataController from './lib/dataController'

vcCake.add('contentWordpressDataSave', (api) => {
  return new DataController({ api: api })
})
