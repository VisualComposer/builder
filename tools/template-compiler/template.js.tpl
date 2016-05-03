vcCake.getService('cook').addElementComponent('reactButton',
  React.createClass({
    render: function () {

      // import settings vars
      {{ settings() }}

      // import template js
      {{ templateJs() }}

      // import template
      return {{ template() }}
    }
  })
);