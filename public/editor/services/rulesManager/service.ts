import vcCake from 'vc-cake'
import { indexOf, get, isEqual } from 'lodash'

interface Rule {
  rule: string,
  options: {
    value: string
  }
}

interface RulesObject {
  [item:string]: Rule
}

interface ObjectValue {
  [item:string]: string|boolean
}

type CheckFunction = () => boolean
type RulePromise = Promise<boolean>

const Rules = {
  true: () => {
    return true
  },
  toggle: (value:boolean|ObjectValue, options:{key:string}) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return !!checkValue
  },
  minlength: (value:string|ObjectValue, options:{length:string, key:string}) => {
    const length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length >= parseInt(length)
  },
  maxlength: (value:string|ObjectValue, options:{length:string, key:string}) => {
    const length = options.length
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length <= parseInt(length)
  },
  range: (value:string|ObjectValue, options: {min: string, max: string, key: string}) => {
    const min = parseInt(options.min)
    const max = parseInt(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return min <= checkValue.length && checkValue.length <= max
  },
  minvalue: (value:string|ObjectValue, options:{min: string, key: string}) => {
    const min = parseFloat(options.min)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = typeof checkValue === 'string' && parseFloat(checkValue)

    return typeof fl === 'number' && fl >= min
  },
  maxvalue: (value:string|ObjectValue, options:{max: string, key: string}) => {
    const max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = typeof checkValue === 'string' && parseFloat(checkValue)

    return typeof fl === 'number' && fl <= max
  },
  between: (value:string|ObjectValue, options:{min: string, max: string, key: string}) => {
    const min = parseFloat(options.min)
    const max = parseFloat(options.max)
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    const fl = typeof checkValue === 'string' && parseFloat(checkValue)

    return typeof fl === 'number' && min <= fl && fl <= max
  },
  value: (value:string|ObjectValue, options:{key: string, value:string}) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }

    return isEqual(checkValue, options.value)
  },
  valueIn: (value:string|ObjectValue, options:{values:string[], key: string}) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return indexOf(options.values, checkValue) > -1
  },
  valueContains: (value:string|ObjectValue, options:{key: string, value:string}) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return (typeof checkValue === 'string' || Array.isArray(checkValue)) && checkValue.indexOf(options.value) > -1
  },
  required: (value:string|ObjectValue, options:{key: string}) => {
    let checkValue = value
    if (options.key) {
      checkValue = get(value, options.key)
    }
    return checkValue.length
  }
}

function createPromise (ruleData:Rule, value:string|boolean, fieldKey:string):Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!ruleData.rule) {
      ruleData.rule = 'true'
    }
    const ruleName = ruleData.rule.replace('!', '')
    const reversed = ruleData.rule[0] === '!'
    // @ts-ignore accessing object property via bracket notation
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

function createSync (ruleData:Rule, value:string|boolean) {
  return () => {
    if (!ruleData.rule) {
      ruleData.rule = 'true'
    }
    const ruleName = ruleData.rule.replace('!', '')
    const reversed = ruleData.rule[0] === '!'
    // @ts-ignore accessing object property via bracket notation
    let result = Rules[ruleName](value, ruleData.options || {})
    if (reversed) {
      result = !result
    }

    return result
  }
}

const RulesManagerAPI = {
  // disabling lint, because values is an element object with different properties
  check: (values:any, rules:RulesObject, resultCallback:(status:boolean) => void) => { // eslint-disable-line
    const keys = Object.keys(rules || {})
    const checks:RulePromise[] = []
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
  // disabling lint, because values is an element object with different properties
  checkSync: (values:any, rules:RulesObject, resultCallback:(status:boolean) => void) => { // eslint-disable-line
    const keys = Object.keys(rules)
    const checks:CheckFunction[] = []
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
