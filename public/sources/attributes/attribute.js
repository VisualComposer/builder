import React from 'react';
export default class Attribute extends React.Component {
  handleChange(event) {
    if('function' === typeof this.props.updater) {
      this.props.updater(this.props.fieldKey, event.target.value);
    }
    this.setState({value: event.target.value});
  }
  render() {
    var {fieldKey, settings, value} = this.props;
    return <div/>;
  }
}