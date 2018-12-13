import React from 'react'
import TreeViewItem from './treeViewItem'
import PropTypes from 'prop-types'
import lodash from 'lodash'

const TreeViewContainerContext = React.createContext()

export default class TreeViewContainerProvider extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      value: this.parseShortcode(props.value, 'content')[ 0 ]
    }
    this.getContent = this.getContent.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.editItem = this.editItem.bind(this)
  }

  parseShortcode (shortcode, level) {
    if (!shortcode) {
      return ''
    }
    const multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
    const shortcodes = shortcode.match(multipleShortcodesRegex)
    if (shortcodes) {
      let returnValue = []
      shortcodes.forEach((item, i) => {
        const parseItem = item.match(localShortcodesRegex)
        let shortcodeData = {
          tag: parseItem[ 2 ],
          params: parseItem[ 3 ],
          content: this.parseShortcode(parseItem[ 5 ], `${level}[${i}].content`),
          index: `${level}[${i}]`
        }
        returnValue.push(shortcodeData)
      })
      return returnValue
    }
    return shortcode
  }

  getContent (content, level) {
    let childComponents = []
    if (content instanceof Array && content && content.length) {
      content.forEach((child, index) => {
        let childProps = {
          tag: child.tag,
          content: child.content,
          index: child.index,
          level: level,
          getContent: this.getContent,
          key: `wpbakery-edit-form-childs-${level}-${index}`
        }
        childComponents.push(<TreeViewItem {...childProps} />)
      })
      return (<ul className='vcv-ui-tree-layout'>{childComponents}</ul>)
    }

    return null
  }

  deleteItem (index) {
    const newValue = lodash.omit(this.state.value, index)
    this.setState({ value: newValue })
  }

  editItem (index) {
    console.log('open edit form for item', index)
    // const value = lodash.get(this.state.value, index)
    //
    // this.props.showEditor(null, value)
    // lodash.get(this.state.value, index)
  }

  render () {
    return (
      <TreeViewContainerContext.Provider
        value={{
          getContent: this.getContent,
          deleteItem: this.deleteItem,
          editItem: this.editItem
        }}
      >
        <div className='vcv-ui-form-dependency'>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              WPB inner elements
            </span>
            <div className='vcv-ui-form-tree-view--attribute'>
              <div className='vcv-ui-tree-layout-container'>
                {this.getContent(this.state.value.content, 0)}
              </div>
            </div>
          </div>
        </div>
      </TreeViewContainerContext.Provider>
    )
  }
}

export const TreeViewContainerConsumer = TreeViewContainerContext.Consumer
