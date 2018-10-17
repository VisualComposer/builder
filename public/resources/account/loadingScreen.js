import React from 'react'
// import { processActions } from './actions'

// const actionData = [
//   {
//     action: 'updatePosts',
//     data: [
//       {
//         id: 5083,
//         editableLink: 'http://vc4.io/?post_type=vcv_templates&p=5083&vcv-editable=1&vcv-source-id=5083&vcv-nonce=1edc2ff5ce',
//         name: 'zxc'
//       },
//       {
//         id: 5813,
//         editableLink: 'http://vc4.io/?post_type=vcv_templates&p=5813&vcv-editable=1&vcv-source-id=5813&vcv-nonce=1edc2ff5ce',
//         name: 'sticky rows'
//       },
//       {
//         id: 5682,
//         editableLink: 'http://vc4.io/?post_type=vcv_templates&p=5682&vcv-editable=1&vcv-source-id=5682&vcv-nonce=1edc2ff5ce',
//         name: 'RED BULL PJ #41'
//       }
//     ]
//   }
// ]

export default class LoadingScreen extends React.Component {
  componentDidMount () {
    // processActions(actionData)
  }

  render () {
    return (
      <div className='vcv-activation-loading-screen'>
        <div className='vcv-loading-dots-container'>
          <div className='vcv-loading-dot vcv-loading-dot-1' />
          <div className='vcv-loading-dot vcv-loading-dot-2' />
        </div>
        <p className='vcv-activation-loading-text'>Downloading bundle 2 of 8: Templates Manager</p>
        <p className='vcv-activation-loading-helper-text'>
          Don't close this window while download is in the progress.
        </p>
      </div>
    )
  }
}
