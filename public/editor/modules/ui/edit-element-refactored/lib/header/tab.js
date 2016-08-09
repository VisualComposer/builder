import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

class EditFormTab extends React.Component {
  static propTypes = {
    changeTab: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool.isRequired,
    data: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    getContainer: React.PropTypes.func.isRequired
  }
  realWidth = null

  onClick = (e) => {
    this.props.changeTab(this.props.index)
  }

  getRealWidth () {
    if (this.realWidth === null) {
      let $el = ReactDOM.findDOMNode(this)
      let $tempEl = $el.cloneNode(true)
      $tempEl.style.position = 'fixed'
      let container = $el.closest(this.props.getContainer())
      container.appendChild($tempEl)
      this.realWidth = $tempEl.offsetWidth
      if (this.realWidth === 0) {
        $tempEl.remove()
        return 0
      }
      let style = window.getComputedStyle($tempEl, null)
      this.realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight)

      $tempEl.remove()
    }

    return this.realWidth
  }

  render () {
    let { data, active } = this.props
    let title = data.settings.options.label

    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': active
    })

    return (
      <a className={tabClasses} href='javascript:;' onClick={this.onClick}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </a>
    )
  }
}

export default EditFormTab
