/* eslint react/jsx-no-bind: "off" */
import React from 'react'
import classNames from 'classnames'

export default class Token extends React.Component {
	static propTypes = {
		value: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]).isRequired,
		index: React.PropTypes.number.isRequired,
		title: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]).isRequired,
		removeCallback: React.PropTypes.func.isRequired,
	}

	constructor (props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick () {
		this.props.removeCallback(this.props.index)
	}

	render () {
		let { title, value } = this.props

		let tagClasses = classNames({
			'vcv-ui-tag-list-item': true,
		})
		return <span
			className={tagClasses}
			title={title}
			data-vcv-tag-list-label={value}
			data-vcv-tag-list-label-hover={value}
		>
      <button className='vcv-ui-tag-list-item-remove' type='button' title='Remove' onClick={this.handleClick}>
        <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
      </button>
    </span>
	}
}
