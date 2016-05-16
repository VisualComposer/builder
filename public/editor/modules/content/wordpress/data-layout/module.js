var vcCake = require('vc-cake')
require('./css/module.less')
vcCake.add('content-wordpress-data-layout', function (api) {
  var React = require('react')
  var ReactDOM = require('react-dom')
  var Element = require('./lib/element.js')
  var DataChanged = {
    componentDidMount: function () {
      api.reply('data:changed', function (document) {
        this.setState({ data: document })
      }.bind(this))
    },
    getInitialState: function () {
      return {
        data: []
      }
    }
  }

  var Layout = React.createClass({
    mixins: [ DataChanged ],
    render: function () {
      let elementsList
      if (this.state.data) {
        let document = vcCake.getService('document')
        elementsList = this.state.data.map(function (element) {
          let data = document.children(element.id)
          return <Element element={element} data={data} key={element.id} api={api}/>
        })
      }
      return (<div className="vc-v-layouts-clean-html">
        {elementsList}
      </div>)
    }
  })
  // Here comes wrapper for navbar
  var wrapper = document.createElement('div')
  wrapper.setAttribute('id', 'vc-wp-data-layout')
  document.body.appendChild(wrapper)
  ReactDOM.render(
    <Layout/>,
    wrapper
  )
})

