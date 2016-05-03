var vcCake = require('vc-cake');
var ActionsManager = {
  ACTION_TYPES: {
    done: {key: 0, name: 'done'},
    fail: {key: 1, name: 'fail'},
    always: {key: 2, name: 'always'}
  },
  do: function(actionsList, props, ruleStatus, ruleData, eventType, actionManagerHelpers, actionType) {
    actionsList.forEach(function(actionData) {
      var actionName = (typeof actionData === 'string' || actionData instanceof String) ? actionData : actionData.action;
      this.actions[actionName].call(this, props,
        ruleStatus,
        ruleData,
        actionData,
        eventType,
        actionManagerHelpers,
        actionType);
    }, this);
  },
  actions: {
    ping: function(props, ruleStatus, ruleData, actionData, eventType, actionManagerHelpers, actionType) {
      console.log({
        ping: {
          props: props,
          value: props.value,
          ruleStatus: ruleStatus,
          ruleData: ruleData,
          actionData: actionData,
          eventType: eventType,
          actionType: actionType,
          actionManagerHelpers: actionManagerHelpers,
        }
      });
    },
    alert: function(props, ruleStatus, ruleData, actionData, eventType, actionManagerHelpers, actionType) {
      var message = actionData && actionData.options ? actionData.options : 'alert:' + ruleStatus;
      alert(message);
    },
    show: function(props, ruleStatus, ruleData, actionData, eventType, actionManagerHelpers, actionType) {
      var target = actionData.options;
      if (typeof target === 'string') {
        actionManagerHelpers.toggleVisible(target, true);
      } else {
        target.forEach(function(item) {
          actionManagerHelpers.toggleVisible(item, true);
        });
      }
    },
    hide: function(props, ruleStatus, ruleData, actionData, eventType, actionManagerHelpers, actionType) {
      var targets = actionData.options;
      if (typeof targets === 'string') {
        actionManagerHelpers.toggleVisible(targets, false);
      } else {
        targets.forEach(function(item) {
          actionManagerHelpers.toggleVisible(item, false);
        });
      }
    },
    preset: function(props, ruleStatus, ruleData, actionData, eventType, actionManagerHelpers, actionType) {
      var key = actionData.options.key;
      var type = actionData.options.type;
      var value = actionData.options.value;

      // var Setter = require('../../../sources/attributes/' + type + '/Setter');
      // Setter(props.editElement, key, value);
      props.editElement[key] = value;
    }
  }
};
vcCake.addService('actions-manager', ActionsManager);
