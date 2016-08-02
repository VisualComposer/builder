import vcCake from 'vc-cake'
import {Deferred} from 'simply-deferred'

const RulesManager = {
  check: (ruleData, value, callback) => {
    let { rule, options } = ruleData
    let deferred = new Deferred()
    deferred.always(callback)
    RulesManager.rules[ rule || 'true' ].call(RulesManager, deferred, value, options)
  },
  rules: {
    true: (deferred) => {
      RulesManager.result(deferred, true)
    },
    toggle: (deferred, value, options) => {
      if (typeof options !== 'undefined') {
        RulesManager.result(deferred, !!value === options)
      } else {
        RulesManager.result(deferred, !!value)
      }
    },
    minlength: (deferred, value, options) => {
      RulesManager.result(deferred, value.length >= parseInt(options))
    },
    maxlength: (deferred, value, options) => {
      RulesManager.result(deferred, value.length <= parseInt(options))
    },
    range: (deferred, value, options) => {
      let min = parseInt(options[ 0 ])
      let max = parseInt(options[ 1 ])

      RulesManager.result(deferred, min <= value.length && value.length <= max)
    },
    minvalue: (deferred, value, options) => {
      let fl = parseFloat(value)
      let min = parseFloat(options)

      RulesManager.result(deferred, !isNaN(fl) && fl >= min)
    },
    maxvalue: (deferred, value, options) => {
      let fl = parseFloat(value)
      let max = parseFloat(options)

      RulesManager.result(deferred, !isNaN(fl) && fl <= max)
    },
    between: (deferred, value, options) => {
      let min = parseFloat(options[ 0 ])
      let max = parseFloat(options[ 1 ])
      let fl = parseFloat(value)

      RulesManager.result(deferred, !isNaN(fl) && min <= fl && fl <= max)
    },
    value: (deferred, value, options) => {
      RulesManager.result(deferred, value.localeCompare(options) === 0)
    },
    required: (deferred, value) => {
      RulesManager.result(deferred, value.length >= 1)
    }
  },
  result: (deferred, ok) => {
    if (ok) {
      deferred.resolve(ok)
    } else {
      deferred.reject(false)
    }
  }
}

vcCake.addService('rules-manager', RulesManager)
