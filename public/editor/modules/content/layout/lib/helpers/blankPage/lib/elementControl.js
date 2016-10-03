import React from 'react'

export default class ContentElementControl extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  }
  // constructor (props) {
  //   super(props)
  // }
  render () {
    let source = `../../../../../../../sources/categories/icons/${this.props.name}.svg`
    return (
      <button
        className='vcv-ui-element-control'
        title={this.props.title}
      >
        <img src={source} alt={this.props.title} />
      </button>
    )
  }
}

