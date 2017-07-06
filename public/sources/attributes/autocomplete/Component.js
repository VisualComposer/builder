import React from 'react'

import Attribute from '../attribute'
import TokenizationList from './lib/tokenizationList'

export default class AutoComplete extends Attribute {
	render () {
		return (
			<TokenizationList
				onChange={this.setFieldValue}
				value={this.props.value}
			/>
		)
	}
}
