import React from 'react'
import TreeViewItem from './treeViewItem'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import WpbakeryModal from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryModal'
import WpbakeryIframe from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryIframe'
import { getStorage } from 'vc-cake'

const TreeViewContainerContext = React.createContext()

export default class TreeViewContainerProvider extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired
  }

  static wpbakeryMapFull = window.VCV_API_WPBAKERY_WPB_MAP_FULL()

  constructor (props) {
    super(props)

    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (!window.wp || !window.wp.shortcode || !window.VCV_API_WPBAKERY_WPB_MAP) {
      let errorMessage = localizations.wpbakeryAttrPluginAndAddonRequired || 'WPBakery plugin and migration addon is required to use this attribute'
      console.warn(errorMessage)
      return
    }

    this.multipleShortcodesRegex = window.wp.shortcode.regexp(window.VCV_API_WPBAKERY_WPB_MAP().join('|'))
    this.localShortcodesRegex = new RegExp(this.multipleShortcodesRegex.source)

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
    const shortcodes = shortcode.match(this.multipleShortcodesRegex)
    if (shortcodes) {
      let returnValue = []
      shortcodes.forEach((item, innerIndex) => {
        const parseItem = item.match(this.localShortcodesRegex)
        let shortcodeData = {
          tag: parseItem[ 2 ],
          params: (parseItem[ 3 ] || '').trim(),
          shortcode: item,
          content: this.parseShortcode((parseItem[ 5 ] || ''), rootLevelChild || `${level}[${innerIndex}].content`),
          index: rootLevel || `${level}[${innerIndex}]`
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
          const itemName = TreeViewContainerProvider.wpbakeryMapFull[child.tag] && TreeViewContainerProvider.wpbakeryMapFull[child.tag].name
          let childProps = {
            tag: itemName || child.tag,
            content: child.content,
            index: child.index,
            level: level,
            shortcode: child.shortcode,
            key: `wpbakery-edit-form-childs-${level}-${index}`
          }
          childComponents.push(<TreeViewItem {...childProps} />)
        }
      })
      return childComponents.length ? <ul className='vcv-ui-tree-layout'>{childComponents}</ul> : null
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
    let { value, editorIndex } = this.state
    let childIndex = `${editorIndex}.content`
    if (editorIndex === 'root') {
      childIndex = 'content'
    }

    const childObj = this.parseShortcode(shortcode, '', editorIndex, childIndex)

    if (editorIndex === 'root') {
      value = childObj
    } else {
      lodash.set(value, editorIndex, childObj)
    }
    this.setState({ value: value })

    let mainContent = this.getContentForSaveMain(value)
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
    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (!this.multipleShortcodesRegex || !this.localShortcodesRegex) {
      const workspaceStorage = getStorage('workspace')
      const workspaceNotifications = workspaceStorage.state('notifications')
      let errorMessage = localizations.wpbakeryAttrPluginAndAddonRequired || 'WPBakery plugin and migration addon is required to use this attribute'
      workspaceNotifications.set({
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        id: 'wpbakeryAttrPluginAndAddonRequired',
        time: 5000
      })
      return null
    }
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
