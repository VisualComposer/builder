var vcCake = require('vc-cake');
var React = require('react');

var classNames = require('classnames');
var RulesManager = vcCake.getService('rules-manager');

require('../../css/edit-form-element.less');
var EditFormElement = React.createClass({
  onOpen: function() {
    var { paramKey, paramSettings, editElement } = this.props;
    var settingsValue = paramSettings.getSettings();
    if (settingsValue && settingsValue.onOpen) {
      console.log('onOpen called');
      var toggleVisible = this.props.toggleVisible;
      var type = paramSettings.getType().toLowerCase();
      var paramValue = this.getValue(editElement, type, paramKey);
      RulesManager.check(
        {value: paramValue, editElement: this.props.editElement},
        settingsValue.onOpen,
        RulesManager.EVENT_TYPES.onOpen, (function() {
        }).bind(this),
        {
          toggleVisible: toggleVisible
        }
      );
    }
  },
  onCancel: function(cancelCallback) {
    var { paramKey, paramSettings, editElement } = this.props;
    var settingsValue = paramSettings.getSettings();
    if (settingsValue && settingsValue.onCancel) {
      console.log('onCancel called');
      var toggleVisible = this.props.toggleVisible;
      var type = paramSettings.getType().toLowerCase();
      var paramValue = this.getValue(editElement, type, paramKey);
      RulesManager.check(
        {value: paramValue, editElement: this.props.editElement},
        settingsValue.onCancel,
        RulesManager.EVENT_TYPES.onCancel, (function() {
          this.props.onCancelItemsAdd(1, cancelCallback);
        }).bind(this),
        {
          toggleVisible: toggleVisible
        }
      );
    } else {
      this.props.onCancelItemsAdd(0, cancelCallback);
    }
  },
  onSave: function(saveCallback) {
    var { paramKey, paramSettings, editElement } = this.props;
    var settingsValue = paramSettings.getSettings();
    if (settingsValue && settingsValue.onSave) {
      var toggleVisible = this.props.toggleVisible;
      var type = paramSettings.getType().toLowerCase();
      var paramValue = this.getValue(editElement, type, paramKey);
      RulesManager.check(
        {value: paramValue, editElement: this.props.editElement},
        settingsValue.onSave,
        RulesManager.EVENT_TYPES.onSave, (function() {
          this.props.onSaveItemsAdd(1, saveCallback);
        }).bind(this),
        {
          toggleVisible: toggleVisible
        }
      );
    } else {
      this.props.onSaveItemsAdd(0, saveCallback);
    }
  },
  onChange: function(value) {
    var { paramKey, paramSettings } = this.props;
    var settingsValue = paramSettings.getSettings();
    if (settingsValue && settingsValue.onChange) {
      console.log('onChange called');
      var toggleVisible = this.props.toggleVisible;
      value.editElement = this.props.editElement;
      RulesManager.check(
        value,
        settingsValue.onChange,
        RulesManager.EVENT_TYPES.onChange, (function() {
          // this.props.publish('onChangeFinished', paramKey);
        }).bind(this),
        {
          toggleVisible: toggleVisible
        }
      );
    }
  },
  componentWillMount: function(paramSettings) {
    this.onOpen();
  },
  getInitialState: function() {
    // console.log( 'EditFormElement getInitialState called' );
    return {};
  },
  getElementAttribute: function() {
    var type = this.props.paramSettings.getType().toLowerCase();
    this.elementAttribute = vcCake.getService('attributes').get(type);
  },
  getComponent: function() {
    this.getElementAttribute();
    return this.props.elementAttribute.getField();
  },
  setValue: function(value) {
    this.getElementAttribute();
    this.props.editElement = this.elementAttribute.setValue(this.props.editElement, value);
    this.props.update(this.props.editElement);
  },
  getValue: function() {
    this.getElementAttribute();
    return this.elementAttribute.getValue(this.props.editElement, this.props.paramKey);
  },
  render: function() {
    var { paramKey, isVisible, paramSettings, editElement } = this.props;
    var formRowClasses = classNames(
      'vc-v-form-row',
      isVisible ? 'vc-rules-manager-visible' : 'vc-rules-manager-hidden'
    );
    var AttributeView = this.getComponent(paramSettings);
    return (
      <div className={formRowClasses}>
        <div className="vcv-form-row-control">
          <AttributeView
            key={vcCake.getService('utils').createKey()}
            element={editElement}
            settings={paramSettings}
            rulesManager={this}
            name={paramKey}
            setValue={this.setValue}
            getValue={this.getValue}
          />
        </div>
      </div>
    );
  }
});
module.exports = EditFormElement;