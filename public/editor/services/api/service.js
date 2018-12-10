import vcCake from 'vc-cake'
import publicAPI from '../../../components/api/publicAPI'
import ElementComponent from './lib/elementComponent'

const Service = {
  publicEvents: publicAPI,
  elementComponent: ElementComponent
}
vcCake.addService('api', Service)
