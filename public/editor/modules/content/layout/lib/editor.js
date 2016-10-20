import {Component, PropTypes} from 'react'
import {getData} from 'vc-cake'
import HtmlLayout from './htmlLayout'
import BlankPage from './helpers/blankPage/component'

export default class LayoutEditor extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.api.reply(
      'data:changed',
      (data) => {
        this.setState({data: data})
      }
    )
  }

  getContent () {
    return this.state.data.length === 0 && getData('app:dataLoaded') === true ? <BlankPage api={this.props.api} /> : <HtmlLayout data={this.state.data} api={this.props.api} />
  }
  render () {
    return (
      <div className='vcv-editor-here'>
        {this.getContent()}
      </div>
    )
  }
}
