(function () {
  window.vcvSandwichModal = function () {
    // Create global element references
    this.modal = null;
    this.openButton = null;
    this.closeButton = null;

    // Define option defaults
    var defaults = {
      container: null,
      modalSelector: null,
      openSelector: null,
      closeSelector: null,
      activeAttribute: null
    };

    // Create options by extending defaults with the passed in arguments
    if (arguments[ 0 ] && typeof arguments[ 0 ] === "object") {
      this.options = extendDefaults(defaults, arguments[ 0 ]);
    }

    initializeEvents.call(this);
  };

  // Public Methods

  window.vcvSandwichModal.prototype.close = function () {
    this.modal.removeAttribute(this.options.activeAttribute);
    document.body.style.overflow = "";
  };

  window.vcvSandwichModal.prototype.open = function () {
    document.body.style.overflow = "hidden";
    this.modal.setAttribute(this.options.activeAttribute, "true");
  };

  // Private Methods

  function extendDefaults (source, properties) {
    var property;
    for (property in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, property)) {
        source[ property ] = properties[ property ];
      }
    }
    return source;
  }

  function initializeEvents () {
    this.modal = this.options.container.querySelector(this.options.modalSelector);
    this.openButton = this.options.container.querySelector(this.options.openSelector);
    this.closeButton = this.options.container.querySelector(this.options.closeSelector);
    this.modalMenuItems = this.options.container.querySelectorAll(this.options.modalSelector + ' .menu-item a');

    if (this.openButton) {
      this.openButton.addEventListener("click", this.open.bind(this));
    }
    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.close.bind(this));
    }

    if (this.modalMenuItems && this.modalMenuItems.length) {
      let that = this;
      this.modalMenuItems.forEach(function(item) {
        item.addEventListener("click", that.close.bind(that));
      });
    }
  }
})();