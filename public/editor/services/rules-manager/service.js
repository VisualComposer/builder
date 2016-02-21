var vcCake = require('vc-cake');

var Deferred = require('simply-deferred').Deferred;
var ActionsManager = vcCake.getService('actions-manager');
var RulesManager = {
  EVENT_TYPES: {
    onOpen: {key: 0, name: 'onOpen'},
    onChange: {key: 1, name: 'onChange'},
    onSave: {key: 2, name: 'onSave'},
    onCancel: {key: 3, name: 'onCancel'}
  },
  check: function(props, eventData, eventType, finishCallback, actionManagerHelpers) {
    var length = eventData.length - 1;
    var valid = true;
    var finishes = 0;
    eventData.forEach(function(ruleData) {
      var deferred = new Deferred();
      deferred.done(
        function(ruleState) {
          if (ruleData.done) {
            ActionsManager.do(ruleData.done,
              props,
              ruleState,
              ruleData,
              eventType,
              actionManagerHelpers,
              ActionsManager.ACTION_TYPES.done);
          }
        }
      ).fail(
        function(ruleState) {
          if (ruleData.fail) {
            ActionsManager.do(ruleData.fail,
              props,
              ruleState,
              ruleData,
              eventType,
              actionManagerHelpers,
              ActionsManager.ACTION_TYPES.fail);
          }
        }
      ).always(
        function(ruleState) {
          if (ruleData.always) {
            ActionsManager.do(ruleData.always,
              props,
              ruleState,
              ruleData,
              eventType,
              actionManagerHelpers,
              ActionsManager.ACTION_TYPES.always);
          }
          if (ruleData.validate) {
            valid &= ruleState;
          }
          if (finishes++ === length && typeof finishCallback === 'function') {
            finishCallback(!!valid);
          }
        }
      );
      this.rules[ruleData.rule].call(this, deferred, props, ruleData, eventType);
    }, this);
  },
  rules: {
    true: function(dfd, props, ruleData) {
      this.result(dfd, true);
    },
    minlength: function(dfd, props, ruleData) {
      this.result(dfd, props.value.length >= parseInt(ruleData.options));
    },
    maxlength: function(dfd, props, ruleData) {
      this.result(dfd, props.value.length <= parseInt(ruleData.options));
    },
    range: function(dfd, props, ruleData) {
      var min = parseInt(ruleData.options[0]);
      var max = parseInt(ruleData.options[1]);
      this.result(dfd, min <= props.value.length && props.value.length <= max);
    },
    minvalue: function(dfd, props, ruleData) {
      var fl = parseFloat(props.value);
      var min = parseFloat(ruleData.options);
      this.result(dfd, !isNaN(fl) && fl >= min);
    },
    maxvalue: function(dfd, props, ruleData) {
      var fl = parseFloat(props.value);
      var max = parseFloat(ruleData.options);
      this.result(dfd, !isNaN(fl) && fl <= max);
    },
    between: function(dfd, props, ruleData) {
      var min = parseFloat(ruleData.options[0]);
      var max = parseFloat(ruleData.options[1]);
      var fl = parseFloat(props.value);
      this.result(dfd, !isNaN(fl) && min <= fl && fl <= max);
    },
    value: function(dfd, props, ruleData) {
      var expected = ruleData.options;
      this.result(dfd, props.value.localeCompare(expected) === 0);
    },
    required: function(dfd, props, ruleData) {
      this.result(dfd, props.value.length >= 1);
    }
  },
  result: function(dfd, ok) {
    if (ok) {
      dfd.resolve(ok);
    } else {
      dfd.reject(false);
    }
  }
};

vcCake.addService('rules-manager', RulesManager);
