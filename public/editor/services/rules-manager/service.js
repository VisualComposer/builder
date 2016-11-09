import vcCake from 'vc-cake'
import {indexOf, get} from 'lodash'
const Rules = {
  true: () => {
    return true
  },
  toggle: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return !!checkValue
  },
  minlength: (value, options) => {
    let length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length >= parseInt(length)
  },
  maxlength: (value, options) => {
    let length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length <= parseInt(length)
  },
  range: (value, options) => {
    let min = parseInt(options.min)
    let max = parseInt(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return min <= checkValue.length && checkValue.length <= max
  },
  minvalue: (value, options) => {
    let min = parseFloat(options.min)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    let fl = parseFloat(checkValue)
    return !isNaN(fl) && fl >= min
  },
  maxvalue: (value, options) => {
    let max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    let fl = parseFloat(checkValue)

    return !isNaN(fl) && fl <= max
  },
  between: (value, options) => {
    let min = parseFloat(options.min)
    let max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    let fl = parseFloat(checkValue)

    return !isNaN(fl) && min <= fl && fl <= max
  },
  value: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.localeCompare(options.value) === 0
  },
  valueIn: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return indexOf(options.values, checkValue) > -1
  },
  required: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length
  }
}

function createPromise (rule, value) {
  return new Promise((resolve, reject) => {
    let ruleName = rule.name.replace('!', '')
    let reversed = rule.name[ 0 ] === '!'
    let result = Rules[ ruleName ](value, rule.options || {})
    if (reversed) {
      result = !result
    }
    if (result) {
      resolve(result)
    } else {
      reject(result)
    }
  })
}
const RulesManagerAPI = {
  check: (values, rules, resultCallback) => {
    let keys = Object.keys(rules)
    let checks = []
    keys.forEach((key) => {
      let rulePromise = createPromise(rules[ key ], values[ key ])
      checks.push(rulePromise)
    })
    Promise.all(checks)
      .then(
        () => {
          resultCallback(true)
        }
      )
      .catch(
        () => {
          resultCallback(false)
        }
      )
  }
}

vcCake.addService('rules-manager', RulesManagerAPI)
