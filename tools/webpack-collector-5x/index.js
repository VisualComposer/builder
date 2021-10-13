import ServicesCollector from './lib/services-collector'
import ModulesCollector from './lib/modules-collector'
import AttributesCollector from './lib/attributes-collector'

class Collector {
  constructor (props) {
    this.options = props
  }

  apply (compiler) {
    Object.keys(this.options).forEach((prefix) => {
      console.log("Webpack v5: Build data for " + prefix)
      let settings = this.options[prefix]
      if (settings.services) {
        ServicesCollector.buildFile(prefix, settings.services)
      }
      if (settings.modules) {
        ModulesCollector.buildFile(prefix, settings.modules)
      }
      AttributesCollector.buildFile(prefix)
    })
  }
}

module.exports = Collector
