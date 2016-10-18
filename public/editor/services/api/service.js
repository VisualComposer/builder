import vcCake from 'vc-cake'
import publicAPI from '../../../resources/api/publicAPI'
import ElementComponent from './lib/elementComponent'

const Service = {
  getDesignOptionsCssClasses (designOptions) {
    let classes = []
    if (designOptions && !(Object.keys(designOptions).length === 0 && designOptions.constructor === Object) && designOptions.used) {
      if (designOptions.deviceTypes === 'all' && (designOptions.all.backgroundColor !== '' || designOptions.all.backgroundImage.urls.length)) {
        classes.push('vce-element--has-background')
      } else {
        let devices = {
          'desktop': 'xl',
          'tablet-landscape': 'lg',
          'tablet-portrait': 'md',
          'mobile-landscape': 'sm',
          'mobile-portrait': 'xs'
        }
        for (let device in devices) {
          if ((designOptions[device].backgroundColor !== '' || designOptions[device].backgroundImage.urls.length)) {
            classes.push('vce-element--' + devices[ device ] + '--has-background')
          }
        }
      }
    }
    return classes
  },
  publicEvents: publicAPI,
  elementComponent: ElementComponent
}
vcCake.addService('api', Service)
