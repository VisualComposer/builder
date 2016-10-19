import Dropdown from '../dropdown/Component'

export default class AnimateDropdown extends Dropdown {
  static animations = [
    {
      group: {
        label: '',
        values: [
          {
            label: 'None',
            value: ''
          }
        ]
      }
    },
    {
      group: {
        label: 'Attention Seekers',
        values: [
          {
            label: 'Bounce',
            value: 'bounce'
          },
          {
            label: 'Flash',
            value: 'flash'
          },
          {
            label: 'Pulse',
            value: 'pulse'
          },
          {
            label: 'Rubber Band',
            value: 'rubberBand'
          },
          {
            label: 'Shake',
            value: 'shake'
          },
          {
            label: 'Swing',
            value: 'swing'
          },
          {
            label: 'Tada',
            value: 'tada'
          },
          {
            label: 'Wobble',
            value: 'wobble'
          },
          {
            label: 'Jello',
            value: 'jello'
          }
        ]
      }
    },
    {
      group: {
        label: 'Bouncing Entrances',
        values: [
          {
            label: 'Bounce In',
            value: 'bounceIn'
          },
          {
            label: 'Bounce In Down',
            value: 'bounceInDown'
          },
          {
            label: 'Bounce In Left',
            value: 'bounceInLeft'
          },
          {
            label: 'Bounce In Right',
            value: 'bounceInRight'
          },
          {
            label: 'Bounce In Up',
            value: 'bounceInUp'
          }
        ]
      }
    },
    {
      group: {
        label: 'Bouncing Exits',
        values: [
          {
            label: 'Bounce Out',
            value: 'bounceOut'
          },
          {
            label: 'Bounce Out Down',
            value: 'bounceOutDown'
          },
          {
            label: 'Bounce Out Left',
            value: 'bounceInLeft'
          },
          {
            label: 'Bounce Out Right',
            value: 'bounceOutRight'
          },
          {
            label: 'Bounce Out Up',
            value: 'bounceOutUp'
          }
        ]
      }
    },
    {
      group: {
        label: 'Fading Entrances',
        values: [
          {
            label: 'Fade In',
            value: 'fadeIn'
          },
          {
            label: 'Fade In Down',
            value: 'fadeInDown'
          },
          {
            label: 'Fade In Down Big',
            value: 'fadeInDownBig'
          },
          {
            label: 'Fade In Left',
            value: 'fadeInLeft'
          },
          {
            label: 'Fade In Left Big',
            value: 'fadeInLeftBig'
          },
          {
            label: 'Fade In Right',
            value: 'fadeInRight'
          },
          {
            label: 'Fade In Right Big',
            value: 'fadeInRightBig'
          },
          {
            label: 'Fade In Up',
            value: 'fadeInUp'
          },
          {
            label: 'Fade In Up Big',
            value: 'fadeInUpBig'
          }
        ]
      }
    },
    {
      group: {
        label: 'Fading Exits',
        values: [
          {
            label: 'Fade Out',
            value: 'fadeOut'
          },
          {
            label: 'Fade Out Down',
            value: 'fadeOutDown'
          },
          {
            label: 'Fade Out Down Big',
            value: 'fadeOutDownBig'
          },
          {
            label: 'Fade Out Left',
            value: 'fadeOutLeft'
          },
          {
            label: 'Fade Out Left Big',
            value: 'fadeOutLeftBig'
          },
          {
            label: 'Fade Out Right',
            value: 'fadeOutRight'
          },
          {
            label: 'Fade Out Right Big',
            value: 'fadeOutRightBig'
          },
          {
            label: 'Fade Out Up',
            value: 'fadeOutUp'
          },
          {
            label: 'Fade Out Up Big',
            value: 'fadeOutUpBig'
          }
        ]
      }
    },
    {
      group: {
        label: 'Flippers',
        values: [
          {
            label: 'Flip',
            value: 'flip'
          },
          {
            label: 'Flip in X',
            value: 'flipInX'
          },
          {
            label: 'Flip in Y',
            value: 'flipInY'
          },
          {
            label: 'Flip out X',
            value: 'flipOutX'
          },
          {
            label: 'Flip out Y',
            value: 'flipOutY'
          }
        ]
      }
    },
    {
      group: {
        label: 'Light Speed',
        values: [
          {
            label: 'Light Speed In',
            value: 'lightSpeedIn'
          },
          {
            label: 'Light Speed Out',
            value: 'lightSpeedOut'
          }
        ]
      }
    },
    {
      group: {
        label: 'Rotating Entrances',
        values: [
          {
            label: 'Rotate In',
            value: 'rotateIn'
          },
          {
            label: 'Rotate In Down Left',
            value: 'rotateInDownLeft'
          },
          {
            label: 'Rotate In Down Right',
            value: 'rotateInDownRight'
          },
          {
            label: 'Rotate In Up Left',
            value: 'rotateInUpLeft'
          },
          {
            label: 'Rotate In Up Right',
            value: 'rotateInUpRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Rotating Exits',
        values: [
          {
            label: 'Rotate Out',
            value: 'rotateOut'
          },
          {
            label: 'Rotate Out Down Left',
            value: 'rotateOutDownLeft'
          },
          {
            label: 'Rotate Out Down Right',
            value: 'rotateOutDownRight'
          },
          {
            label: 'Rotate Out Up Left',
            value: 'rotateOutUpLeft'
          },
          {
            label: 'Rotate Out Up Right',
            value: 'rotateOutUpRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Sliding Entrances',
        values: [
          {
            label: 'Slide In Up',
            value: 'slideInUp'
          },
          {
            label: 'Slide In Down',
            value: 'slideInDown'
          },
          {
            label: 'Slide In Left',
            value: 'slideInLeft'
          },
          {
            label: 'Slide In Right',
            value: 'slideInRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Sliding Exits',
        values: [
          {
            label: 'Slide Out Up',
            value: 'slideOutUp'
          },
          {
            label: 'Slide Out Down',
            value: 'slideOutDown'
          },
          {
            label: 'Slide Out Left',
            value: 'slideOutLeft'
          },
          {
            label: 'Slide Out Right',
            value: 'slideOutRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Zoom Entrances',
        values: [
          {
            label: 'Zoom In',
            value: 'zoomIn'
          },
          {
            label: 'Zoom In Up',
            value: 'zoomInUp'
          },
          {
            label: 'Zoom In Down',
            value: 'zoomInDown'
          },
          {
            label: 'Zoom In Left',
            value: 'zoomInLeft'
          },
          {
            label: 'Zoom In Right',
            value: 'zoomInRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Zoom Exits',
        values: [
          {
            label: 'Zoom Out',
            value: 'zoomOut'
          },
          {
            label: 'Zoom Out Up',
            value: 'zoomOutUp'
          },
          {
            label: 'Zoom Out Down',
            value: 'zoomOutDown'
          },
          {
            label: 'Zoom Out Left',
            value: 'zoomOutLeft'
          },
          {
            label: 'Zoom Out Right',
            value: 'zoomOutRight'
          }
        ]
      }
    },
    {
      group: {
        label: 'Specials',
        values: [
          {
            label: 'Hinge',
            value: 'hinge'
          },
          {
            label: 'Roll In',
            value: 'rollIn'
          },
          {
            label: 'Roll Out',
            value: 'rollOut'
          }
        ]
      }
    }
  ]
  getSelectOptions () {
    return this.props.options && this.props.options.values
      ? this.props.options.values
      : AnimateDropdown.animations
  }
}
