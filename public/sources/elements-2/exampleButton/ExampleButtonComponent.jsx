import {Component} from 'react';
export class ExampleButton extends Component {
  render() {
    let {key, content, ...other} = this.props;
    return <button type="button" className="vc-button-block" key={key}>
      {content}
    </button>;
  }
}