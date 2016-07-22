import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import WordPressLayout from './lib/layout'
import './css/module.less'

vcCake.add('content-wordpress-data-layout', (api) => {
  // Here comes wrapper for navbar
  let wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vcv-wp-data-layout')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <WordPressLayout api={api} />,
    wrapper
  )
})
