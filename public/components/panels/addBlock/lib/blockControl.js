import React from 'react'
import PropTypes from 'prop-types'
import HubBlockControl from './hubBlockControl'
import CustomBlockControl from './customBlockControl'
import { env } from 'vc-cake'

const hubBlockTypes = ['block']

export default class BlockControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyBlock: PropTypes.func.isRequired,
    removeBlock: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.handleApplyBlock = this.handleApplyBlock.bind(this)
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this)
  }

  handleApplyBlock (e) {
    e && e.preventDefault()
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      this.props.applyBlock(this.props.id, this.props.type)
    } else {
      this.props.applyBlock(this.props.data || {}, this.props.type)
    }
  }

  handleRemoveBlock () {
    this.props.removeBlock(this.props.id, this.props.type)
  }

  getCustomTemplateControl () {
    const props = {
      ...this.props,
      handleApplyBlock: this.handleApplyBlock,
      handleRemoveBlock: this.handleRemoveBlock
    }
    return <CustomBlockControl {...props} />
  }

  getHubTemplateControl () {
    const props = {
      ...this.props,
      handleApplyBlock: this.handleApplyBlock,
      handleRemoveBlock: this.handleRemoveBlock,
    }
    return <HubBlockControl {...props} />
  }

  render () {
    const { type } = this.props
    return type && hubBlockTypes.includes(type) ? this.getHubTemplateControl() : this.getCustomTemplateControl()
  }
}
