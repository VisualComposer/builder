import React, { createRef } from 'react'
import vcCake from 'vc-cake'
import HtmlLayout from './htmlLayout'
import { bindEditorKeys } from 'public/tools/comboKeys'
import PropTypes from 'prop-types'
import { ElementData } from 'public/types/data'

const elementsStorage = vcCake.getStorage('elements')
const wordpressDataStorage = vcCake.getStorage('wordpressData')
const workspaceStorage = vcCake.getStorage('workspace')

type StateData = ElementData[]
interface EditorProps {
  api: {
    name: string,
    actions: {
      // Comes from a 3rd party library, could hold any value
      [key:string]: any // eslint-disable-line
    },
    // Comes from a 3rd party library, could hold any value
    [key:string]: any // eslint-disable-line
  }
}

interface EditorState {
  data: StateData,
  isNavbarDisabled: boolean
}

export default class LayoutEditor extends React.Component<EditorProps, EditorState> {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  document = createRef<HTMLDivElement>()

  constructor (props:EditorProps) {
    super(props)
    const data = elementsStorage.state('document').get() || []
    this.state = {
      data,
      isNavbarDisabled: true
    }
    this.updateState = this.updateState.bind(this)
    this.handleNavbarStateChange = this.handleNavbarStateChange.bind(this)
  }

  updateState (data:StateData) {
    this.setState({ data }, () => {
      wordpressDataStorage.state('lastAction').set('contentBuilt')
    })
  }

  componentDidMount () {
    elementsStorage.state('document').onChange(this.updateState)
    workspaceStorage.state('navbarDisabled').onChange(this.handleNavbarStateChange)
    this.props.api.notify('editor:mount')
  }

  componentWillUnmount () {
    elementsStorage.state('document').ignoreChange(this.updateState)
    workspaceStorage.state('navbarDisabled').ignoreChange(this.handleNavbarStateChange)
  }

  handleNavbarStateChange (isDisabled:boolean) {
    if (this.state.isNavbarDisabled && !isDisabled) {
      bindEditorKeys(this.document.current)
      this.setState({ isNavbarDisabled: false })
    }
  }

  getContent () {
    return (<HtmlLayout data={this.state.data} api={this.props.api} />)
  }

  render () {
    return (
      <div className='vcv-editor-here' ref={this.document}>
        {this.getContent()}
      </div>
    )
  }
}
