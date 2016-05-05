var React = require( 'react' );
var ReactDOM = require('react-dom');
var classNames = require( 'classnames' );

var TreeContentTab = React.createClass({
  getInitialState: function () {
    return {
      realWidth: undefined
    }
  },
  componentDidMount: function () {
    this.setState({
      realWidth: this.getRealWidth()
    })
  },

  getRealWidth: function (  ) {
    let realWidth = this.state.realWidth;

    if (realWidth == undefined) {
      let $el = ReactDOM.findDOMNode(this ),
          $tempEl = $el.cloneNode(true);
        $tempEl.style.position = 'fixed';
        $el.closest(this.props.container ).appendChild($tempEl);
      realWidth = $tempEl.offsetWidth;
      if (realWidth == 0) {
        return undefined;
      }
      let style = window.getComputedStyle($tempEl, null);
      realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight);

      $tempEl.remove();
    }
    return realWidth;
  },

  clickHandler: function () {
    this.props.changeActive(this.props.id);
  },

  render: function () {
    let {title, active} = this.props;

    var tabClasses = classNames( {
      "vc-ui-editor-tab": true,
      "vc-ui-active": active
    } );

    return (
      <a className={tabClasses} href="#" onClick={this.clickHandler}><span className="vc-ui-editor-tab-content"><span>{title}</span></span></a>
    );
  }
});

module.exports = TreeContentTab;