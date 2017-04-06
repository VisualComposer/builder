import React from 'react'
import classNames from 'classnames'
import ElementControl from './elementControl'
import Scrollbar from '../../../scrollbar/scrollbar.js'
import SearchElement from './searchElement'
import '../css/init.less'
import vcCake from 'vc-cake'
const categoriesService = vcCake.getService('hubCategories')
const groupsService = vcCake.getService('hubGroups')
const sharedAssetsLibraryService = vcCake.getService('sharedAssetsLibrary')

const workspaceStorage = vcCake.getStorage('workspace')
const cook = vcCake.getService('cook')
let allCategories = []

export default class Categories extends React.Component {
  static propTypes = {
    elements: React.PropTypes.array.isRequired,
    options: React.PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      activeCategoryIndex: 0,
      inputValue: '',
      isSearching: '',
      centered: false
    }
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeSearchState = this.changeSearchState.bind(this)
    this.changeInput = this.changeInput.bind(this)
  }

  componentWillMount () {
    this.categoriesFromProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.categoriesFromProps(nextProps)
  }

  getElementsList (groupCategories, tags) {
    let groupElements = []
    if (groupCategories === true) {
      // Get ALL
      let allCategories = categoriesService.all()
      Object.keys(allCategories).forEach((categoryKey) => {
        let groupCategoryData = allCategories[ categoryKey ]
        if (groupCategoryData && groupCategoryData.elements) {
          groupElements = groupElements.concat(groupCategoryData.elements.filter((tag) => {
            return tags.indexOf(tag) > -1
          }))
        }
      })
    } else {
      groupCategories.forEach((category) => {
        let groupCategoryData = categoriesService.get(category)
        if (groupCategoryData && groupCategoryData.elements) {
          groupElements = groupElements.concat(groupCategoryData.elements.filter((tag) => {
            return tags.indexOf(tag) > -1
          }))
        }
      })
    }

    return groupElements
  }

  categoriesFromProps (props) {
    let groupsStore = {}
    let groups = groupsService.all()
    if (!allCategories.length) {
      const tags = props.elements.map((e) => { return e.tag })
      allCategories = groups.filter((group) => {
        groupsStore[ group.title ] = this.getElementsList(group.categories, tags)
        return groupsStore[ group.title ].length > 0
      }).map((group, index) => {
        return {
          id: group.title + index, // TODO: Should it be more unique?
          index: index,
          title: group.title,
          elements: groupsStore[ group.title ],
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

  getNoResultsElement () {
    let source = sharedAssetsLibraryService.getSourcePath('images/search-no-result.png')

    return <div className='vcv-ui-editor-no-items-container'>
      <div className='vcv-ui-editor-no-items-content'>
        <img
          className='vcv-ui-editor-no-items-image'
          src={source}
          alt='Nothing Found'
        />
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <button className='vcv-ui-editor-no-items-action'>No Results. Open Visual Composer Hub</button>
      </div>
      <div className='vcv-ui-editor-no-items-content'>
        <p className='vcv-ui-form-helper'>
          Didn't find the right element? Check out Visual Composer Hub for more content elements.
        </p>
      </div>
    </div>
  }

  getElementControl (tag) {
    let element = cook.get({ tag: tag }).toJS()

    return <ElementControl
      key={'vcv-element-control-' + element.tag}
      element={element}
      tag={element.tag}
      workspace={workspaceStorage.state('settings').get() || {}}
      name={element.name} />
  }

  changeSearchState (state) {
    this.setState({
      isSearching: state
    })
  }

  getSearchProps () {
    return {
      allCategories: allCategories,
      index: this.state.activeCategoryIndex,
      changeActive: this.changeActiveCategory,
      changeTerm: this.changeSearchState,
      changeInput: this.changeInput
    }
  }

  getSearchElement () {
    let searchProps = this.getSearchProps()
    return <SearchElement {...searchProps} />
  }

  getSearchResults () {
    let { inputValue } = this.state
    let getIndex = allCategories.findIndex((val) => {
      return val.title === 'All'
    })
    return allCategories[ getIndex ].elements.filter((val) => {
      let elName = val.toLowerCase()
      return elName.indexOf(inputValue.trim()) !== -1
    }).map((tag) => {
      return this.getElementControl(tag)
    })
  }

  getElementsByCategory () {
    let { activeCategoryIndex } = this.state

    return allCategories && allCategories[ activeCategoryIndex ] && allCategories[ activeCategoryIndex ].elements ? allCategories[ activeCategoryIndex ].elements.map((tag) => {
      return this.getElementControl(tag)
    }) : []
  }

  getElementListContainer (itemsOutput) {
    return itemsOutput.length ? <div className='vcv-ui-item-list-container'>
      <ul className='vcv-ui-item-list'>
        {itemsOutput}
      </ul>
    </div> : this.getNoResultsElement()
  }

  isSearching () {
    let { isSearching, inputValue } = this.state
    return isSearching && inputValue.trim()
  }

  render () {
    let itemsOutput = this.isSearching() ? this.getSearchResults() : this.getElementsByCategory()
    let innerSectionClasses = classNames({
      'vcv-ui-tree-content-section-inner': true,
      'vcv-ui-state--centered-content': !itemsOutput.length
    })
    return <div className='vcv-ui-tree-content'>
      {this.getSearchElement()}
      <div className='vcv-ui-tree-content-section'>
        <Scrollbar>
          <div className={innerSectionClasses}>
            <div className='vcv-ui-editor-plates-container'>
              <div className='vcv-ui-editor-plates'>
                <div className='vcv-ui-editor-plate vcv-ui-state--active'>
                  {this.getElementListContainer(itemsOutput)}
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  }
}
