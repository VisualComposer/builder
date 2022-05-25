import vcCake from 'vc-cake'

const ActionsManager = {
  do: (actionData, state, target, element) => {
    const { action, options } = actionData
    ActionsManager.actions[action || 'ping'].call(ActionsManager, state, target, options, element)
  },
  actions: {
    ping: (state, target, options) => {
      console.log('ping', state, target, options)
    },
    toggleVisibility: (state, target, options) => {
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
    toggleSectionVisibility: (state, target, options) => {
      ActionsManager.actions.toggleVisibility(state, target, options)
    },
    attachImageUrls: (state, target, options, element) => {
      if (target.refAttributeComponent && target.refAttributeComponent.updateExtraAttributesStates) {
        target.refAttributeComponent.updateExtraAttributesStates('url', state)
        return
      }
      if (element.settings(target.key).settings.options.url === state) {
        return
      }
      element.settings(target.key).settings.options.url = state
      target.refWrapperComponent.forceUpdate()
    },
    updateDependenciesClasses: (state, target, options) => {
      const newStateClasses = (target.refWrapperComponent.state.dependenciesClasses || []).filter((item) => {
        return item !== options.class
      })
      if (state) {
        newStateClasses.push(options.class)
      }
      target.refWrapper.parentNode.parentNode && target.refWrapperComponent.setState({ dependenciesClasses: newStateClasses })
    },
    fieldMethod: (state, target, options, element) => {
      // FOR BC, for new elements use "attributeComponentMethod"
      ActionsManager.actions.attributeComponentMethod(state, target, options, element)
    },
    attributeComponentMethod: (state, target, options, element) => {
      if (target.refAttributeComponent && target.refAttributeComponent[options.method]) {
        target.refAttributeComponent[options.method](state, target, options, element)
      }
    }
  }
}

vcCake.addService('actionsManager', ActionsManager)
