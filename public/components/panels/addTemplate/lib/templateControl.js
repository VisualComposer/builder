import React from 'react'
import PropTypes from 'prop-types'
import HubTemplateControl from './hubTemplateControl'
import CustomTemplateControl from './customTemplateControl'
import { env } from 'vc-cake'

const hubTemplateTypes = ['predefined', 'hub', 'hubHeader', 'hubFooter', 'hubSidebar', 'block']

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyTemplate: PropTypes.func.isRequired,
    removeTemplate: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.handleApplyTemplate = this.handleApplyTemplate.bind(this)
    this.handleRemoveTemplate = this.handleRemoveTemplate.bind(this)
  }

  handleApplyTemplate (e) {
    e && e.preventDefault()
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      this.props.applyTemplate(this.props.id, this.props.type)
    } else {
      this.props.applyTemplate(this.props.data || {}, this.props.type)
    }
  }

  handleRemoveTemplate () {
    this.props.removeTemplate(this.props.id, this.props.type)
  }

  getCustomTemplateControl () {
    const props = {
      ...this.props,
      handleApplyTemplate: this.handleApplyTemplate,
      handleRemoveTemplate: this.handleRemoveTemplate
    }
    return <CustomTemplateControl {...props} />
  }

  getHubTemplateControl () {
    const props = {
      ...this.props,
      handleApplyTemplate: this.handleApplyTemplate,
      handleRemoveTemplate: this.handleRemoveTemplate
    }
    return <HubTemplateControl {...props} />
  }

  render () {
    const { type } = this.props
    return type && hubTemplateTypes.includes(type) ? this.getHubTemplateControl() : this.getCustomTemplateControl()
  }
}
