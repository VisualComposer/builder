import React from 'react';
export default class Attribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
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