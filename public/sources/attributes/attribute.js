import React from 'react';
export default class Attribute extends React.Component {
  constructor(props) {
    super();
    this.state = {value: props.value};
  }

  handleChange(event) {
    if ('function' === typeof this.props.updater) {
      this.props.updater(this.props.fieldKey, event.target.value);
    }
    this.setState({value: event.target.value});
  }

  render() {
    let {fieldKey, settings, value} = this.props;
    return <div/>;
  }
}