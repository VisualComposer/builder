import React from 'react'
import TreeViewItem from './treeViewItem'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import WpbakeryModal from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryModal'
import WpbakeryIframe from 'public/sources/attributes/wpbakeryEditForm/lib/wpbakeryIframe'
import { getStorage } from 'vc-cake'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

let wpbakeryMapFull = {}
if (!(!window.wp || !window.wp.shortcode || !window.VCV_API_WPBAKERY_WPB_MAP)) {
  wpbakeryMapFull = window.VCV_API_WPBAKERY_WPB_MAP_FULL()
}
const TreeViewContainerContext = React.createContext()

const DragHandle = SortableHandle(() => {
  let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
  return (
    <div className={dragHelperClasses}>
      <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
    </div>
  )
})

const SortableItem = SortableElement((props) => {
  return <TreeViewItem {...props}><DragHandle /></TreeViewItem>
})

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul className='vcv-ui-tree-layout'>
      {items.map((child, index) => {
        if (child.tag) {
          const itemName = wpbakeryMapFull[ child.tag ] && wpbakeryMapFull[ child.tag ].name
          let childProps = {
            tag: itemName || child.tag,
            content: child.content,
            editorIndex: child.editorIndex,
            level: child.level,
            shortcode: child.shortcode,
            key: `wpbakery-edit-form-childs-${index}`,
            index: index
          }
          return <SortableItem {...childProps} />
        }
      })}
    </ul>
  )
})

export default class TreeViewContainerProvider extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    updater: PropTypes.func.isRequired
  }

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
      value: this.parseShortcode(props.value, 0, '', 'root', 'content'),
      showEditor: false,
      editorValue: null,
      editorIndex: null,
      editorLevel: 0
    }
    this.getContent = this.getContent.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.close = this.close.bind(this)
    this.save = this.save.bind(this)
  }

  componentWillReceiveProps (newProps, prevProps) {
    this.setState({
      value: this.parseShortcode(newProps.value, 0, '', 'root', 'content'),
      showEditor: false,
      editorValue: null,
      editorIndex: null,
      editorLevel: 0
    })
  }

  parseShortcode (shortcode, numLevel, level, rootLevel, rootLevelChild) {
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
          level: numLevel,
          content: this.parseShortcode((parseItem[ 5 ] || ''), numLevel + 1, rootLevelChild || `${level}[${innerIndex}].content`),
          editorIndex: rootLevel || `${level}[${innerIndex}]`
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

  getContent (content, level, index) {
    if (content instanceof Array && content && content.length) {
      return <SortableList items={content} onSortEnd={this.onSortEnd.bind(this, index)} useDragHandle helperClass={'vcv-ui-tree-layout-node-child--drag-item'} />
    }

    return null
  }

  deleteItem (index) {
    const newValue = index === 'root' ? {} : lodash.omit(this.state.value, index)
    this.setState({ value: newValue })
    let mainContent = this.getContentForSaveMain(newValue)
    this.props.updater(mainContent)
  }

  editItem (level, index, shortcode) {
    this.setState({ showEditor: true, editorValue: shortcode, editorIndex: index, editorLevel: level })
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

    const childObj = this.parseShortcode(shortcode, this.state.editorLevel, '', editorIndex, childIndex)

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

  onSortEnd = (editorIndex, { oldIndex, newIndex }) => {
    let { value } = this.state
    let innerValue
    if (editorIndex === 'root') {
      innerValue = value
    } else {
      innerValue = lodash.get(value, editorIndex)
    }
    innerValue.content = arrayMove(innerValue.content, oldIndex, newIndex)
    if (editorIndex === 'root') {
      value = innerValue
    } else {
      lodash.set(value, editorIndex, innerValue)
    }
    this.setState({ value: value })
    let mainContent = this.getContentForSaveMain(value)
    this.props.updater(mainContent)
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
    let mainParent = this.state.value
    let parentComponent
    if (mainParent.tag) {
      const itemName = wpbakeryMapFull[ mainParent.tag ] && wpbakeryMapFull[ mainParent.tag ].name
      let parentProps = {
        tag: itemName || mainParent.tag,
        content: mainParent.content,
        editorIndex: mainParent.index || 'root',
        level: 0,
        shortcode: mainParent.shortcode,
        key: `wpbakery-edit-form-parent`
      }
      parentComponent = <ul className='vcv-ui-tree-layout'><TreeViewItem {...parentProps} /></ul>
    }
    if (!parentComponent) {
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
              <div className='vcv-ui-tree-layout-container' data-vcv-wbpakery-tree-view>
                {parentComponent}
              </div>
            </div>
          </div>
        </div>
      </TreeViewContainerContext.Provider>
    )
  }
}

export const TreeViewContainerConsumer = TreeViewContainerContext.Consumer
