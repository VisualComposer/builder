import vcCake from 'vc-cake'

interface Target {
  key:string,
  refAttributeComponent: {
    updateExtraAttributesStates: (url:string, state:boolean) => void
  },
  refWrapper: {
    parentNode: {
      parentNode:HTMLElement
    }
  },
  refWrapperComponent: {
    state: {
      dependenciesClasses:[]
    },
    setState: (newState: {dependenciesClasses:string[]}) => void,
    forceUpdate: () => void
  },
  type:string,
  value:string
}

interface ElementSetting {
  settings: {
    options: {
      url:boolean
    }
  }
}

interface Element {
  settings: (key:string) => ElementSetting,
}

interface Options {
  method?:string,
  class?:string
}

interface ActionData {
  action:string,
  options:Options
}

interface ActionsManagerService {
  do: (actionData:ActionData, state:boolean, target:Target, element:Element) => void,
  actions: {
    ping: (state:boolean, target:Target, options:Options) => void,
    toggleVisibility: (state:boolean, target:Target, options:Options) => void,
    toggleSectionVisibility: (state:boolean, target:Target, options:Options) => void,
    updateDependenciesClasses: (state:boolean, target:Target, options:Options) => void,
    attachImageUrls: (state:boolean, target:Target, options:Options, element:Element) => void,
    fieldMethod: (state:boolean, target:Target, options:Options, element:Element) => void,
    attributeComponentMethod: (state:boolean, target:Target, options:Options, element:Element) => void
  }
}

const ActionsManager:ActionsManagerService = {
  do: (actionData:ActionData, state:boolean, target:Target, element:Element) => {
    const { action, options } = actionData
    // @ts-ignore accessing object property via bracket notation
    ActionsManager.actions[action || 'ping'].call(ActionsManager, state, target, options, element)
  },
  actions: {
    ping: (state:boolean, target:Target, options:Options) => {
      console.log('ping', state, target, options)
    },
    toggleVisibility: (state:boolean, target:Target, options:Options) => {
      if (typeof options !== 'undefined') {
        // Reverse state
        state = options ? !state : state
      }
      ActionsManager.actions.updateDependenciesClasses.call(this, state, target, {
        class: 'vcv-ui-state--visible'
      })
      ActionsManager.actions.updateDependenciesClasses.call(this, !state, target, {
        class: 'vcv-ui-state--hidden'
      })
    },
    toggleSectionVisibility: (state:boolean, target:Target, options:Options) => {
      ActionsManager.actions.toggleVisibility(state, target, options)
    },
    attachImageUrls: (state:boolean, target:Target, options:Options, element:Element) => {
      if (target.refAttributeComponent && target.refAttributeComponent.updateExtraAttributesStates) {
        target.refAttributeComponent.updateExtraAttributesStates('url', state)
        return
      }
      const elementSettings:ElementSetting = element.settings(target.key)
      if (elementSettings.settings.options.url === state) {
        return
      }
      elementSettings.settings.options.url = state
      target.refWrapperComponent.forceUpdate()
    },
    updateDependenciesClasses: (state:boolean, target:Target, options:Options) => {
      const newStateClasses:string[] | [] = (target.refWrapperComponent.state.dependenciesClasses || []).filter((item:string) => {
        return item !== options.class
      })
      if (state && options.class) {
        newStateClasses.push(options.class)
      }
      const newState = {
        dependenciesClasses: newStateClasses
      }
      target.refWrapper.parentNode.parentNode && target.refWrapperComponent.setState(newState)
    },
    fieldMethod: (state:boolean, target:Target, options:Options, element:Element) => {
      // FOR BC, for new elements use "attributeComponentMethod"
      ActionsManager.actions.attributeComponentMethod(state, target, options, element)
    },
    attributeComponentMethod: (state:boolean, target:Target, options:Options, element:Element) => {
      // @ts-ignore accessing object property via bracket notation
      if (options.method && target.refAttributeComponent && target.refAttributeComponent[options.method]) {
        // @ts-ignore accessing object property via bracket notation
        target.refAttributeComponent[options.method](state, target, options, element)
      }
    }
  }
}

vcCake.addService('actionsManager', ActionsManager)
