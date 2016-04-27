import {Component} from 'react';
export class ExampleButton extends Component {
  render() {
    let {key, content, ...other} = this.props;
    return <button type="button" className="vce-example-button vc-example-button-{shape}" key={key}>
      {content}
    </button>;
  }
}