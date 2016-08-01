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
          title: 'All',
          icon: ''
        },
        {
          strid: 'desktop',
          title: 'Desktop',
          icon: 'vcv-ui-icon-desktop'
        },
        {
          strid: 'tablet-landscape',
          title: 'Tablet Landscape',
          icon: 'vcv-ui-icon-tablet-landscape'
        },
        {
          strid: 'tablet-portrait',
          title: 'Tablet Portrait',
          icon: 'vcv-ui-icon-tablet-portrait'
        },
        {
          strid: 'mobile-landscape',
          title: 'Mobile Landscape',
          icon: 'vcv-ui-icon-mobile-landscape'
        },
        {
          strid: 'mobile-portrait',
          title: 'Mobile Portrait',
          icon: 'vcv-ui-icon-mobile-portrait'
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

  handleChange: function (device) {
    let value = device

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
        'vcv-ui-form-button': true,
        'vcv-ui-state--active': that.state.value === device.strid
      })
      let icons = classNames([
        'vcv-ui-form-button-icon',
        'vcv-ui-icon',
        device.icon
      ])

      items.push(<button
        key={'device-' + device.strid}
        onClick={this.handleChange.bind(this, device.strid)}
        className={classes}
        title={device.title}
        data-vcv-device={device.strid}>
        <i className={icons}></i>
      </button>)
    })

    return <div className="vcv-ui-form-buttons-group vcv-ui-form-button-group-action">
      {items}
    </div>
  }
})

module.exports = Devices
