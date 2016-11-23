import React from 'react'

export default class Categories extends React.Component {
  static propTypes = {
    allTabs: React.PropTypes.array.isRequired,
    changeActive: React.PropTypes.func.isRequired,
    updateTabs: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    elements: React.PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      indexOfAll: null,
      initialTabs: null,
      activeIndex: null
    }
    this.searchElements = this.searchElements.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  componentWillMount () {
    this.setState({
      activeIndex: this.props.index,
      initialTabs: this.props.allTabs
    })
    let indexOfAll = this.props.allTabs.findIndex((obj) => {
      return obj.title === 'All'
    })
    this.setState({
      indexOfAll: indexOfAll
    })
  }

  handleBlur () {
    this.props.changeActive(this.state.activeIndex)
    this.props.updateTabs(this.state.indexOfAll, this.state.initialTabs)
  }

  searchElements (e) {
    let result = []
    let inputVal = e.currentTarget.value.toLowerCase()
    this.props.changeActive(0)
    // console.log(this.props.changeActive)

    if (inputVal.trim()) {
      result = this.props.elements.filter((val) => {
        let elName = val.name.toLowerCase()
        return val.hasOwnProperty('name') && elName.indexOf(inputVal) !== -1
      })
      this.props.updateTabs(this.state.indexOfAll, result)
    }
  }

  render () {
    console.log('search props: ', this.props)
    return <div className='vcv-ui-editor-search-container'>
      <span className='vcv-ui-editor-search-icon' />
      <input
        className='vcv-ui-editor-search-field'
        onKeyUp={this.searchElements}
        onBlur={this.handleBlur}
        type='text'
        placeholder='Search content elements by name, category and description'
      />
    </div>
  }
}
