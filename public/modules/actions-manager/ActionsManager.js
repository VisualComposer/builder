var ActionsManager = {
	ACTION_TYPES: {
		done: { key: 0, name: 'done' },
		fail: { key: 1, name: 'fail' },
		always: { key: 2, name: 'always' }
	},
	do: function ( actionsList, props, ruleStatus, ruleData, eventType, actionType ) {
		actionsList.forEach( function ( actionData ) {
			var actionName = (typeof actionData === 'string' || actionData instanceof String ) ? actionData : actionData.action;
			this.actions[ actionName ].call( this, props,
				ruleStatus,
				ruleData,
				actionData,
				eventType,
				actionType );
		}, this );
	},
	actions: {
		ping: function ( props, ruleStatus, ruleData, actionData, eventType, actionType ) {
			console.log( {
				ping: {
					value: props.value,
					ruleStatus: ruleStatus,
					ruleData: ruleData,
					actionData: actionData,
					eventType: eventType,
					actionType: actionType
				}
			} );
		},
		alert: function ( props, ruleStatus, ruleData, actionData, eventType, actionType ) {
			var message = actionData && actionData.options ? actionData.options : 'alert:' + ruleStatus;
			alert( message );
		}
	}
};

module.exports = ActionsManager;
