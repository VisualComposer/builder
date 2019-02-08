import React from 'react'
import Attribute from '../attribute'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

export default class CalendarAttribute extends Attribute {
  updateState (props) {
    return {
      value: props.value ? new Date(props.value) : new Date()
    }
  }

  handleChange (date) {
    this.setFieldValue(date)
  }

  getCalendarProps () {
    const props = {
      selected: this.state.value,
      onChange: this.handleChange,
      disabledKeyboardNavigation: true,
      calendarClassName: 'vcv-ui-form-datepicker',
      className: 'vcv-ui-form-input',
      popperClassName: 'vcv-ui-form-datepicker-popper',
      dateFormat: 'MMMM d, yyyy',
      popperPlacement: 'bottom-start',
      popperModifiers: {
        flip: {
          behavior: [ 'bottom' ]
        },
        preventOverflow: {
          enabled: false
        },
        hide: {
          enabled: false
        }
      }
    }
    if (this.props.options.hasOwnProperty('time') && this.props.options.time) {
      props.calendarClassName = 'vcv-ui-form-datepicker vcv-ui-form-datepicker-time'
      props.showTimeSelect = true
      props.timeIntervals = this.props.options.timeIntervals || 10
      props.timeFormat = 'h:mm aa'
      props.dateFormat = 'MMMM d, yyyy h:mm aa'
      props.timeCaption = 'Time'
    }
    return props
  }

  render () {
    return <DatePicker {...this.getCalendarProps()} />
  }
}
