import vcCake from 'vc-cake'
import publicAPI from '../../../resources/api/publicAPI'
import ElementComponent from './lib/elementComponent'

const Service = {
  publicEvents: publicAPI,
  elementComponent: ElementComponent
}
vcCake.addService('api', Service)
