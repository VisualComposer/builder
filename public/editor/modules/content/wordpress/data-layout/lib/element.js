/*eslint jsx-quotes: ["error", "prefer-double"]*/
var vcCake = require('vc-cake')
var React = require('react')
var cook = vcCake.getService('cook')
var Element = React.createClass({
  render: function () {
    let element = cook.get(this.props.element)
    return element.render()
  }
})
module.exports = Element
