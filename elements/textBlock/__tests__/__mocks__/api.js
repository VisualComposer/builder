import vcCake from 'vc-cake'
import publicAPI from '../../../../public/resources/api/publicAPI'
import ElementComponent from '../../../../public/editor/services/api/lib/elementComponent'

const Service = {
  publicEvents: publicAPI,
  elementComponent: ElementComponent
}
vcCake.addService('api', Service)
