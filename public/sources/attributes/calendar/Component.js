import React from 'react'
import Attribute from '../attribute'
import DatePicker from 'react-datepicker'
import moment from 'moment'

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

  handleChangeRaw = (date) => {
    // Need to do a check when time is changed inside input
    // DatePicker library doesn't handle this case at the moment
    if (date.target && moment(date.target.value).isValid()) {
      this.handleChange(new Date(date.target.value))
    }
  }

  getCalendarProps () {
    const props = {
      selected: this.state.value,
      onChange: this.handleChange,
      onChangeRaw: this.handleChangeRaw,
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
