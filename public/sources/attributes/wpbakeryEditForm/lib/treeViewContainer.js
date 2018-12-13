import React from 'react'
import TreeViewItem from './treeViewItem'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import WpbakeryModal from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryModal'
import WpbakeryIframe from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryIframe'

const TreeViewContainerContext = React.createContext()

export default class TreeViewContainerProvider extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      value: this.parseShortcode(props.value, '', 'root', 'content'),
      showEditor: false,
      editorValue: null,
      editorIndex: null
    }
    this.getContent = this.getContent.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.close = this.close.bind(this)
    this.save = this.save.bind(this)
  }

  componentWillReceiveProps (newProps, prevProps) {
    this.setState({
      value: this.parseShortcode(newProps.value, '', 'root', 'content'),
      showEditor: false,
      editorValue: null,
      editorIndex: null
    })
  }

  parseShortcode (shortcode, level, rootLevel, rootLevelChild) {
    if (!shortcode) {
      return ''
    }
    const multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    const localShortcodesRegex = new RegExp(multipleShortcodesRegex.source)
    const shortcodes = shortcode.match(multipleShortcodesRegex)
    if (shortcodes) {
      let returnValue = []
      shortcodes.forEach((item, innerIndex) => {
        const parseItem = item.match(localShortcodesRegex)
        let shortcodeData = {
          tag: parseItem[ 2 ],
          params: (parseItem[ 3 ] || '').trim(),
          shortcode: item,
          content: this.parseShortcode((parseItem[ 5 ] || ''), (!rootLevelChild ? (`${level}[${innerIndex}].content`) : rootLevelChild)),
          index: !rootLevel ? `${level}[${innerIndex}]` : rootLevel
        }
        if (rootLevel) {
          returnValue = shortcodeData
        } else {
          returnValue.push(shortcodeData)
        }
      })
      return returnValue
    }
    return shortcode
  }

  getContent (content, level) {
    let childComponents = []
    if (content instanceof Array && content && content.length) {
      content.forEach((child, index) => {
        if (child.tag && child.index) {
          let childProps = {
            tag: child.tag,
            content: child.content,
            index: child.index,
            level: level,
            shortcode: child.shortcode,
            key: `wpbakery-edit-form-childs-${level}-${index}`
          }
          childComponents.push(<TreeViewItem {...childProps} />)
        }
      })
      return (<ul className='vcv-ui-tree-layout'>{childComponents}</ul>)
    }

    return null
  }

  deleteItem (index) {
    const newValue = index === 'root' ? {} : lodash.omit(this.state.value, index)
    this.setState({ value: newValue })
    let mainContent = this.getContentForSaveMain(newValue)
    this.props.updater(mainContent)
  }

  editItem (index, shortcode) {
    this.setState({ showEditor: true, editorValue: shortcode, editorIndex: index })
  }

  close () {
    this.setState({
      showEditor: false
    })
  }

  save (shortcode) {
    const childObj = this.parseShortcode(shortcode, `${this.state.editorIndex}`, `${this.state.editorIndex}`, `${this.state.editorIndex}.content`)
    lodash.set(this.state.value, this.state.editorIndex, childObj)

    let mainContent = this.getContentForSaveMain(this.state.value)
    this.props.updater(mainContent)
    this.close()
  }

  getContentForSaveMain = (obj) => {
    let getContent = (obj) => {
      if (obj && obj.tag) {
        if (obj.content) {
          if (obj.content instanceof Array) {
            return `[${obj.tag} ${obj.params}]${obj.content.map(getContent).join('')}[/${obj.tag}]`
          } else {
            return `[${obj.tag} ${obj.params}]${obj.content}[/${obj.tag}]`
          }
        } else {
          return `[${obj.tag} ${obj.params}]`
        }
      }

      return ''
    }

    return getContent(obj)
  }

  render () {
    if (lodash.isEmpty(this.state.value)) {
      return null
    }

    let content = this.getContent([ this.state.value ], 0)
    if (!content) {
      return null
    }

    return (
      <TreeViewContainerContext.Provider
        value={{
          getContent: this.getContent,
          deleteItem: this.deleteItem,
          editItem: this.editItem
        }}
      >
        {this.state.showEditor ? <WpbakeryModal>
          <WpbakeryIframe close={this.close} save={this.save} value={this.state.editorValue} />
        </WpbakeryModal> : null}
        <div className='vcv-ui-form-dependency'>
          <div className='vcv-ui-form-group'>
            <div className='vcv-ui-form-tree-view--attribute'>
              <div className='vcv-ui-tree-layout-container'>
                {content}
              </div>
            </div>
          </div>
        </div>
      </TreeViewContainerContext.Provider>
    )
  }
}

export const TreeViewContainerConsumer = TreeViewContainerContext.Consumer
