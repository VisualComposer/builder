import React from 'react'
import ReactDOM from 'react-dom'
// import classNames from 'classnames'
// import CategoryTab from './categoryTab'
import ElementControl from './elementControl'
import Scrollbar from '../../../../../resources/scrollbar/scrollbar.js'
import Search from './search'
import '../css/init.less'
import {getService} from 'vc-cake'
const categoriesService = getService('categories')
// let allTabs = [] // TODO remove after refactor
let allCategories = []

export default class Categories extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    elements: React.PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      // categoriesHash: '',
      activeCategoryIndex: 0,
      inputValue: '',
      // tabsHash: '',
      // visibleTabsCount: 0,
      // activeTabIndex: 0,
      searchTerm: ''
    }
    // this.changeActiveTab = this.changeActiveTab.bind(this) // TODO remove after refactor
    this.changeActiveCategory = this.changeActiveCategory.bind(this)
    this.changeTerm = this.changeTerm.bind(this)
    this.changeInput = this.changeInput.bind(this)
    // this.tabsFromProps = this.tabsFromProps.bind(this) // TODO remove after refactor
    // this.categoriesFromProps = this.categoriesFromProps.bind(this) // TODO remove after refactor
  }

  componentWillMount () {
    // this.tabsFromProps(this.props) // TODO remove after refactor
    this.categoriesFromProps(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // this.tabsFromProps(nextProps) // TODO remove after refactor
    this.categoriesFromProps(nextProps)
  }

  componentDidMount () {
    this.addResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
    window.setTimeout(this.handleElementResize.bind(this), 0)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs-free-space'), this.handleElementResize)
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    var obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this && this.contentDocument && this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    if (element.__resizeTrigger__) {
      element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
      element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
    }
  }

  handleElementResize = () => {
    this.refreshTabs()
  }

  // TODO remove after refactor
  // getTabsHash (tabs) {
  //   let hash = ''
  //   for (let tab of tabs) {
  //     hash += tab.id
  //   }
  //   return hash
  // }

  // getCategoriesHash (tabs) {
  //   let hash = ''
  //   for (let tab of tabs) {
  //     hash += tab.id
  //   }
  //   return hash
  // }

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
    // this.setState({
    //   categoriesHash: this.getCategoriesHash(allCategories)
    // })
  }

  // TODO remove after refactor
  // tabsFromProps (props) {
  //   let groupsStore = {}
  //   let groups = categoriesService.groups
  //   if (!allTabs.length) {
  //     allTabs = groups.filter((group) => {
  //       groupsStore[ group.label ] = this.getElementsList(group.elements, props.elements)
  //       return groupsStore[ group.label ].length > 0
  //     }).map((group, index) => {
  //       return {
  //         id: group.label + index, // TODO: Should it be more unique?
  //         index: index,
  //         title: group.label,
  //         elements: groupsStore[ group.label ],
  //         isVisible: true
  //       }
  //     })
  //   }
  //   this.setState({
  //     tabsHash: this.getTabsHash(allTabs)
  //   })
  // }

  // TODO remove after refactor
  // changeActiveTab (tabIndex) {
  //   this.setState({
  //     activeTabIndex: tabIndex
  //   })
  // }

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

  // TODO remove after refactor
  // getVisibleTabs () {
  //   return allTabs.filter((tab) => {
  //     if (tab.isVisible) {
  //       return true
  //     }
  //   })
  // }

  // TODO remove after refactor
  // getHiddenTabs () {
  //   let tabs = allTabs.filter((tab) => {
  //     return !tab.isVisible
  //   })
  //   tabs.reverse()
  //   return tabs
  // }

  // TODO remove after refactor
  // refreshTabs () {
  //   let $tabsLine = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tabs')
  //   let $freeSpaceEl = $tabsLine.querySelector('.vcv-ui-editor-tabs-free-space')
  //   let freeSpace = $freeSpaceEl.offsetWidth
  //   // If there is no space move tab from visible to hidden tabs.
  //   let visibleAndUnpinnedTabs = this.getVisibleTabs()
  //   if (freeSpace === 0 && visibleAndUnpinnedTabs.length > 0) {
  //     let lastTab = visibleAndUnpinnedTabs.pop()
  //     allTabs[ lastTab.index ].isVisible = false
  //     this.setState({
  //       visibleTabsCount: visibleAndUnpinnedTabs.length
  //     })
  //     this.refreshTabs()
  //     return
  //   }
  //   // If we have free space move tab from hidden tabs to visible.
  //   let hiddenTabs = this.getHiddenTabs()
  //   if (hiddenTabs.length) {
  //     // if it is las hidden tab than add dropdown width to free space
  //     if (hiddenTabs.length === 1) {
  //       let dropdown = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-editor-tab-dropdown')
  //       freeSpace += dropdown.offsetWidth
  //     }
  //     while (freeSpace > 0 && hiddenTabs.length) {
  //       let lastTab = hiddenTabs.pop()
  //       let controlsSize = lastTab.ref.getRealWidth()
  //       freeSpace -= controlsSize
  //       if (freeSpace > 0) {
  //         allTabs[ lastTab.index ].isVisible = true
  //       }
  //     }
  //     this.setState({
  //       visibleTabsCount: this.getVisibleTabs().length
  //     })
  //   }
  // }

  getRenderedElements () {
    let { activeCategoryIndex, searchTerm } = this.state
    let itemsOutput = []
    if (searchTerm) {
      this.props.elements.filter((val) => {
        let elName = val.name.toLowerCase()
        return val.hasOwnProperty('name') && elName.indexOf(this.state.inputValue) !== -1
      }).forEach((element) => {
        itemsOutput.push(<ElementControl
          api={this.props.api}
          key={'vcv-element-control-' + element.tag}
          element={element}
          tag={element.tag}
          name={element.name} />)
      })
    } else {
      console.log('regular output')
      itemsOutput = allCategories[ activeCategoryIndex ].elements.map((element) => {
        return <ElementControl
          api={this.props.api}
          key={'vcv-element-control-' + element.tag}
          element={element}
          tag={element.tag}
          name={element.name} />
      })
    }
    return <div className='vcv-ui-add-element-list-container'>
      <ul className='vcv-ui-add-element-list'>
        {itemsOutput}
      </ul>
    </div>
  }

  // TODO remove after refactor
  // getTabProps (tabIndex, activeTabIndex) {
  //   let tab = allTabs[ tabIndex ]
  //
  //   return {
  //     key: tab.id,
  //     id: tab.id,
  //     index: tab.index,
  //     title: tab.title,
  //     active: (activeTabIndex === tab.index),
  //     container: '.vcv-ui-editor-tabs',
  //     ref: (ref) => {
  //       if (allTabs[ tab.index ]) {
  //         allTabs[ tab.index ].ref = ref
  //       }
  //     },
  //     changeActive: this.changeActiveTab
  //   }
  // }

  // getCategoryProps (catIndex, activeCatIndex) {
  //   let cat = allCategories[ catIndex ]
  //
  //   return {
  //     key: cat.id,
  //     id: cat.id,
  //     index: cat.index,
  //     title: cat.title,
  //     active: (activeCatIndex === cat.index),
  //     container: '.vcv-ui-editor-tabs',
  //     ref: (ref) => {
  //       if (allCategories[ cat.index ]) {
  //         allCategories[ cat.index ].ref = ref
  //       }
  //     },
  //     changeActive: this.changeActiveCategory
  //   }
  // }

  changeTerm (term) {
    this.setState({
      searchTerm: term
    })
  }

  // TODO remove after refactor
  // updateTabs (index, result) {
  //   allTabs[index].elements = result
  // }

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

  render () {
    // TODO remove after refactor
    // let { activeTabIndex } = this.state
    // let visibleTabs = []
    // let hiddenTabs = []
    // allTabs.forEach((tab) => {
    //   let { ...tabProps } = this.getTabProps(tab.index, activeTabIndex)
    //   if (tab.isVisible) {
    //     visibleTabs.push(<CategoryTab {...tabProps} />)
    //   } else {
    //     hiddenTabs.push(<CategoryTab {...tabProps} />)
    //   }
    // })
    // let hiddenTabsComponent = ''
    // if (hiddenTabs.length) {
    //   let dropdownClasses = classNames({
    //     'vcv-ui-editor-tab-dropdown': true,
    //     'vcv-ui-editor-tab-collapse': true,
    //     'vcv-ui-state--active': !!hiddenTabs.filter(function (tab) {
    //       return tab.index === activeTabIndex
    //     }).length
    //   })
    //   hiddenTabsComponent = <dl className={dropdownClasses}>
    //     <dt className='vcv-ui-editor-tab-dropdown-trigger vcv-ui-editor-tab' title='More'>
    //       <span className='vcv-ui-editor-tab-content'>
    //         <i className='vcv-ui-editor-tab-icon vcv-ui-icon vcv-ui-icon-more-dots' />
    //       </span>
    //     </dt>
    //     <dd className='vcv-ui-editor-tab-dropdown-content'>
    //       {hiddenTabs}
    //     </dd>
    //   </dl>
    // }

    // <div className='vcv-ui-editor-tabs-container'>
    //   <nav className='vcv-ui-editor-tabs'>
    //     {visibleTabs}
    //     {hiddenTabsComponent}
    //     <span className='vcv-ui-editor-tabs-free-space' />
    //   </nav>
    // </div>

    let searchProps = this.getSearchProps()
    let searchField = <Search {...searchProps} />

    return <div className='vcv-ui-tree-content'>
      {searchField}

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
