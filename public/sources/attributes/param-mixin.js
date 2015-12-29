var Mixin = {
    getInitialState: function() {
        return {
            value: this.props.value
        }
    },
    handleChange: function() {
        this.setState({value: this.refs.fcomponent.value});
    }
};

module.exports = Mixin;