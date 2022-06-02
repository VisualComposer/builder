'use strict'

import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Swatch from './Swatch'
import reactCSS from 'reactcss'

class UsedStack extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare.bind(this, this, nextProps, nextState)
  }

  handleClick = (hex) => {
    this.props.onClick({
      hex,
      source: 'hex'
    })
  }

  render () {
    const styles = reactCSS({
      default: {
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
