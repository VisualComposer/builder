/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')

var Devices = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    value: React.PropTypes.string
  },

  statics: {
    getAll: function () {
      return [
        {
          strid: 'all',
          title: 'All'
        },
        {
          strid: 'desktop',
          title: 'Desktop'
        },
        {
          strid: 'tablet',
          title: 'Tablet'
        },
        {
          strid: 'mobile',
          title: 'Mobile'
        }
      ]
    }
  },

  getInitialState: function () {
    return {
      value: 'desktop'
    }
  },

  componentWillMount () {
    if (this.props.value) {
      this.setState({ value: this.props.value })
    }
  },

  handleChange: function (e) {
    let value = e.target.dataset.vcvDevice

    if (value === this.state.value) {
      return
    }

    this.setState({
      value: value
    })

    this.props.onChange(value)
  },

  render: function () {
    let that = this
    let items = []

    Devices.getAll().map((device) => {
      if (device.strid === 'all') {
        return
      }

      let classes = classNames({
        'vcv-ui-design-options-device': true,
        'vcv-ui-active': that.state.value === device.strid
      })

      items.push(<button
        key={'device-' + device.strid}
        onClick={this.handleChange}
        className={classes}
        data-vcv-device={device.strid}>
        {device.title}
      </button>)
    })

    return <div className="vcv-ui-design-options-devices">{items}</div>
  }
})

module.exports = Devices
