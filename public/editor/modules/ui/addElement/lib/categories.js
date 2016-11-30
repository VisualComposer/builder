import React from 'react'
import ElementControl from './elementControl'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import '../css/init.less'
import {getService} from 'vc-cake'
const categoriesService = getService('categories')
let allCategories = []

export default class Categories extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    elements: React.PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      activeCategoryIndex: 0,
      inputValue: '',
      searchTerm: ''
    }
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeTerm = this.changeTerm.bind(this)
    this.changeInput = this.changeInput.bind(this)
  }

  componentWillMount () {
    this.categoriesFromProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.categoriesFromProps(nextProps)
  }

  getElementsList (groupCategories, elements) {
    const tags = elements.map((e) => { return e.tag })
    return groupCategories.filter((element) => {
      return tags.indexOf(element.tag) > -1
    })
  }

  categoriesFromProps (props) {
    let groupsStore = {}
    let groups = categoriesService.groups
    if (!allCategories.length) {
      allCategories = groups.filter((group) => {
        groupsStore[ group.label ] = this.getElementsList(group.elements, props.elements)
        return groupsStore[ group.label ].length > 0
      }).map((group, index) => {
        return {
          id: group.label + index, // TODO: Should it be more unique?
          index: index,
          title: group.label,
          elements: groupsStore[ group.label ],
          isVisible: true
        }
      })
    }
  }

  changeActiveCategory (catIndex) {
    this.setState({
      activeCategoryIndex: catIndex
    })
  }

  changeInput (value) {
    this.setState({
      inputValue: value
    })
  }

  getElementListContainer (itemsOutput) {
    return <div className='vcv-ui-add-element-list-container'>
      <ul className='vcv-ui-add-element-list'>
        {itemsOutput}
      </ul>
    </div>
  }

  getNoResultsElement () {
    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <button className='vcv-ui-editor-no-items-action'>No Results. Open Visual Composer Hub</button>
        <p className='vcv-ui-form-helper'>Didn't find the right element? Check out Visual Composer Hub for more content elements.</p>
      </div>
    </div>
  }

  getElementControl (element) {
    return <ElementControl
      api={this.props.api}
      key={'vcv-element-control-' + element.tag}
      element={element}
      tag={element.tag}
      name={element.name} />
  }

  getRenderedElements () {
    let { activeCategoryIndex, searchTerm, inputValue } = this.state
    let itemsOutput = []
    if (searchTerm && inputValue.trim()) {
      let getIndex = allCategories.findIndex((val) => {
        return val.title === 'All'
      })
      allCategories[getIndex].elements.filter((val) => {
        let elName = val.name.toLowerCase()
        return val.hasOwnProperty('name') && elName.indexOf(inputValue.trim()) !== -1
      }).forEach((element) => {
        itemsOutput.push(this.getElementControl(element))
      })
    } else {
      itemsOutput = allCategories[ activeCategoryIndex ].elements.map((element) => {
        return this.getElementControl(element)
      })
    }
    if (!itemsOutput.length) {
      return this.getNoResultsElement()
    }
    return this.getElementListContainer(itemsOutput)
  }

  changeTerm (term) {
    this.setState({
      searchTerm: term
    })
  }

  getSearchProps () {
    return {
      allCategories: allCategories,
      index: this.state.activeCategoryIndex,
      changeActive: this.changeActiveCategory,
      elements: this.props.elements,
      changeTerm: this.changeTerm,
      changeInput: this.changeInput
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  render () {
    return <div className='vcv-ui-tree-content'>
      {this.getSearchElement()}
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className='vcv-ui-tree-content-section-inner'>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  {this.getRenderedElements()}
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
