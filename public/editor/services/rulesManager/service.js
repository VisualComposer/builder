import vcCake from 'vc-cake'
import { indexOf, get, isEqual } from 'lodash'

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
    const length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length >= parseInt(length)
  },
  maxlength: (value, options) => {
    const length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length <= parseInt(length)
  },
  range: (value, options) => {
    const min = parseInt(options.min)
    const max = parseInt(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return min <= checkValue.length && checkValue.length <= max
  },
  minvalue: (value, options) => {
    const min = parseFloat(options.min)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = parseFloat(checkValue)
    return !isNaN(fl) && fl >= min
  },
  maxvalue: (value, options) => {
    const max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = parseFloat(checkValue)

    return !isNaN(fl) && fl <= max
  },
  between: (value, options) => {
    const min = parseFloat(options.min)
    const max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = parseFloat(checkValue)

    return !isNaN(fl) && min <= fl && fl <= max
  },
  value: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }

    return isEqual(checkValue, options.value)
  },
  valueIn: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return indexOf(options.values, checkValue) > -1
  },
  valueContains: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.indexOf(options.value) > -1
  },
  required: (value, options) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length
  }
}

function createPromise (ruleData, value, fieldKey) {
  return new Promise((resolve, reject) => {
    if (!ruleData.rule) {
      ruleData.rule = 'true'
    }
    const ruleName = ruleData.rule.replace('!', '')
    const reversed = ruleData.rule[0] === '!'
    let result = Rules[ruleName](value, ruleData.options || {}, fieldKey)
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

function createSync (ruleData, value) {
  return () => {
    if (!ruleData.rule) {
      ruleData.rule = 'true'
    }
    const ruleName = ruleData.rule.replace('!', '')
    const reversed = ruleData.rule[0] === '!'
    let result = Rules[ruleName](value, ruleData.options || {})
    if (reversed) {
      result = !result
    }

    return result
  }
}

const RulesManagerAPI = {
  check: (values, rules, resultCallback) => {
    const keys = Object.keys(rules || {})
    const checks = []
    keys.forEach((key) => {
      const rulePromise = createPromise(rules[key], values[key], key)
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
  },
  checkSync: (values, rules, resultCallback) => {
    const keys = Object.keys(rules)
    const checks = []
    keys.forEach((key) => {
      const ruleFn = createSync(rules[key], values[key])
      checks.push(ruleFn)
    })
    let res = false
    for (let i = 0; i < checks.length; i++) {
      res = checks[i]()
      if (!res) {
        break
      }
    }
    resultCallback(res)
    return res
  }
}

vcCake.addService('rulesManager', RulesManagerAPI)
