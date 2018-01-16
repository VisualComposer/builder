'use strict' /* @flow */

import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Swatch from './Swatch'
import reactCSS from 'reactcss'

export class UsedStack extends React.Component {
  shouldComponentUpdate = shallowCompare.bind(this, this, arguments[0], arguments[1])

  handleClick = (hex: any) => {
    this.props.onClick({
      hex,
      source: 'hex'
    })
  }

  render (): any {
    const styles = reactCSS({
      'default': {
        swatchWrap: {
          width: '16px',
          height: '16px',
          margin: '0px 0px 10px 10px'
        },
        swatch: {
          borderRadius: '3px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)'
        }
      },
      'no-presets': {
        colors: {
          display: 'none'
        }
      }
    }, {
      'no-presets': !this.props.colors || !this.props.colors.length
    })

    return (
      <div className='vcv-ui-color-picker-used-stack-wrapper'>
        <div className='vcv-ui-color-picker-used-stack'>
          {this.props.colors.map((value, index) => {
            return (
              <div style={styles.swatchWrap} key={value + index}>
                <Swatch
                  color={value}
                  style={styles.swatch}
                  onClick={this.handleClick}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default UsedStack
