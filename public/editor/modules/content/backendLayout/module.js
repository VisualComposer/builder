import vcCake from 'vc-cake'
import ReactDOM from 'react-dom'
import React from 'react'
import Layout from './lib/layout'

if (vcCake.env('FEATURE_WPBACKEND')) {
  vcCake.add('backendLayout', (api) => {
    ReactDOM.render(
      <Layout api={api} />,
      document.getElementById('vcv-layout-backend-content')
    )
  })
}
