import vcCake from 'vc-cake'
import DataController from './lib/data-controller'

vcCake.add('content-wordpress-data-save', (api) => {
  return new DataController({ api: api })
})
