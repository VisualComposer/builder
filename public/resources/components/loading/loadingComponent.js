import React from 'react'

export default class LoadingComponent extends React.Component {
  render () {
    return <div className='vcv-loading-overlay'>
      <div className='vcv-loading-overlay-inner'>
        <div className='vcv-loading-dots-container'>
          <div className='vcv-loading-dot vcv-loading-dot-1' />
          <div className='vcv-loading-dot vcv-loading-dot-2' />
        </div>
      </div>
    </div>
  }
}
