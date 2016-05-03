vcCake.getService('cook').addElementComponent('reactButton',
  React.createClass({
    render: function() {

      // import settings vars
      var {tag, title, style, color, iconSize, ...other} = this.props;

      // import template js
      var buttonClass = 'vc-button';
      if (color) {
        buttonClass += ' vc-button-color-' + color;
      }

      if (style) {
        buttonClass += ' vc-button-style-' + style;
      }

      var isRounded = (style == 'rounded') ? true : null;
      var iconClass = 'vc-icon vc-icon-size-' + iconSize;
      var iconContent = '♘';

      // import template
      return <button type="button" className="{buttonClass} some-other-class" key={key}>
        {(() => {
          if (isRounded) {
            return <i className="{iconClass}">{iconContent}</i>
          }
        })()}
        {title}
      </button>
    }
  })
);