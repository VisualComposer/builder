'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import map from 'lodash/map'
import shallowCompare from 'react-addons-shallow-compare'

import Swatch from './Swatch'

class SketchPresetColors extends React.Component {
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
      <div className='vcv-ui-color-picker-presets-color'>
        {map(this.props.colors, (c) => {
          return (
            <div style={styles.swatchWrap} key={c}>
              <Swatch
                color={c}
                style={styles.swatch}
                onClick={this.handleClick}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export default SketchPresetColors
