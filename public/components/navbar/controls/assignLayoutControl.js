import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default class AssignLayoutControl extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault && e.preventDefault()
    const adminLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''

    window.location.href = adminLink + 'admin.php?page=vcv-headers-footers'
  }

  render () {
    const assignLayoutTitle = localizations ? localizations.assignLayout : 'Assign Layout to ...'
    return (
      <>
        <div className='vcv-ui-navbar-controls-set'>
          <span
            className='vcv-ui-navbar-control'
            onClick={this.handleClick}
            title={assignLayoutTitle}
          >{assignLayoutTitle}
          </span>
        </div>
      </>
    )
  }
}
