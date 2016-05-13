import React from 'react';
export default class Attribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setFieldValue(event.target.value);
  }

  setFieldValue(value) {
    if ('function' === typeof this.props.updater) {
      this.props.updater(this.props.fieldKey, value);
    }
    this.setState({value: value});
  }

  render() {
    let {fieldKey, settings, value} = this.props;
    return <div/>;
  }
}