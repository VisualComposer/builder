var mediator = module.exports = (function(){
	var subscribe = function(channel, fn){
		if(!mediator.channels[channel]) mediator.channels[channel] = [];
		mediator.channels[channel].push({ context : this, callback : fn });
		return this;
	};
	var publish = function(channel){
		if(!mediator.channels[channel]) return false;
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0, l = mediator.channels[channel].length; i < l; i++){
			var subscription = mediator.channels[channel][i];
			subscription.callback.apply(subscription.context, args);
		};
		return this;
	};
	var services = {};
	return {
		channels : {},
		publish : publish,
		subscribe : subscribe,
		installTo : function(obj){
			obj.subscribe = subscribe;
			obj.publish = publish;
			return obj;
		},
		addService: function(name, obj) {
			services[name] = obj;
		},
		getService: function(name) {
			return services[name] || null;
		}
	};
}());