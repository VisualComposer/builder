import React from 'react'
import reactCSS from 'reactcss'

export const Swatch = (props) => {
  const convertStyles = (color) => {
    let styles = {
      height: '100%',
      width: '100%',
      cursor: 'pointer',
      backgroundColor: color
    }
    if (color === 'rgba(186, 218, 85, 0)') {
      color = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAG5JREFUOBFjZCATvI+MtP//9+9aRnL0wzUzMweTbACyZsHlyw+SZAC6ZpDriTYAm2aiDcClmSgD8GkmaAAhzXgNIEYzTgOI1YzVAFI0YxhAqmYUA8jRDDeAXM1gAyjRDDKACZwlgbkKlDFAAqQCAB5beZgTNEIdAAAAAElFTkSuQmCC")'
      styles.backgroundColor = ''
      styles.backgroundImage = color
    }
    return styles
  }

  const styles = reactCSS({
    'default': {
      swatch: convertStyles(props.color)
    },
    'custom': {
      swatch: props.style
    }
  }, 'custom')

  const handleClick = (e) => {
    props.onClick && props.onClick(props.color, e)
  }

  return (
    <div style={styles.swatch} onClick={handleClick} />
  )
}

export default Swatch
