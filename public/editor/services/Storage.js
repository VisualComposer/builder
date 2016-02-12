var vcCake = require('vc-cake');
/**
 * Data Module
 */
var DataStore = {
  document: null,
  create: function(element) {
    var DOMElement = this.document.createElement(element.tag);
    var elementId = document.createAttribute('id');       // Create a "id" attribute
    elementId.value = Mediator.getService('utils').createKey();
    DOMElement.setAttributeNode(elementId);

    Object.keys(element).forEach(function(k) {
      let param = element[k];
      //if ('content' === k && 'public' === param.getAccess()) {
      //   let textNode = document.createTextNode(param.toString());
      //  DOMElement.appendChild(textNode);
      if ('public' === param.getAccess()) {
        var key = k;
        let elementParam = document.createAttribute(key);
        elementParam.value = param.toString() || "";
        DOMElement.setAttributeNode(elementParam);
      }
    }, this);
    return DOMElement;
  },
  add: function(element, parentNode) {
    // @todo Here we should use immutable data.
    if (parentNode) {
      let DOMElement = this.create(element);
      // Set the value of the class attribute
      parentNode.appendChild(DOMElement);
      return DOMElement;
    }
    return false;
  },
  remove: function(id) {
    var DOMElement = this.document.getElementById(id);
    if (DOMElement) {
      DOMElement.parentNode.removeChild(DOMElement);
      return true;
    }
    return false;
  },
  clone: function(id) {
    var DOMElement = this.document.getElementById(id);
    if (DOMElement) {
      let DOMElementClone = DOMElement.cloneNode(true);
      DOMElementClone.setAttribute('id', Mediator.getService('utils').createKey());
      this.changeChildrenIds(DOMElementClone.childNodes);
      DOMElement.parentNode.insertBefore(DOMElementClone, DOMElement.nextSibling)
      return true;
    }
    return false;
  },
  changeChildrenIds: function(nodes) {
    let list = Array.prototype.slice.call(nodes);
    list.forEach(function(node) {
      if (node.setAttribute) {
        node.setAttribute('id', Mediator.getService('utils').createKey());
        this.changeChildrenIds(node.childNodes);
      }
    }, this);
  },
  move: function(id, beforeId) {
    let beforeDOMElement, DOMElement = this.document.getElementById(id);
    if (DOMElement) {
      if (beforeId) {
        beforeDOMElement = this.document.getElementById(beforeId);
        if (beforeDOMElement) {
          beforeDOMElement.parentNode.insertBefore(DOMElement, beforeDOMElement);
          return true;
        }
      } else {
        DOMElement.parentNode.appendChild(DOMElement);
        return true;
      }
    }
    return false;
  },
  moveTo: function(dragId, targetId, action) {
    let dragEl = this.document.getElementById(dragId),
      targetEl = this.document.getElementById(targetId);
    if (dragEl && targetEl) {
      switch (action) {
        case 'before':
          targetEl.parentNode.insertBefore(dragEl, targetEl);
          return true;
          break;
        case 'after':
          if (targetEl.nextSibling) {
            targetEl.parentNode.insertBefore(dragEl, targetEl.nextSibling);
          } else {
            targetEl.parentNode.appendChild(dragEl);
          }
          return true;
          break;
        case 'into':
          targetEl.appendChild(dragEl);
          return true;
          break;
      }
    }
    return false;
  },
  mutate: function(element) {
    /*
     var DOMElement = this.document.getElementById(element.getAttribute('id'));
     DOMElement.setAttribute('id', 'vc-mutate-tmp-' + Math.random());
     DOMElement.parentNode.insertBefore(element, DOMElement);
     DOMElement.parentNode.removeChild(DOMElement);
     */
    return true;
  },
  get: function(id) {
    var DOMElement = this.document.getElementById(id);
    return DOMElement; // .cloneNode(true);
  }
};


/**
 * Data module API
 * @type {{activeNode: null, resetActiveNode: Data.resetActiveNode}}
 */
var Data = {
  activeNode: null,
  getDocument: function() {
    return DataStore.document ? DataStore.document : null;
  },
  setDocument: function(document) {
    DataStore.document = document;
    Data.publish('data:changed', Data.getDocument());
  },
  resetActiveNode: function() {
    this.activeNode = null;
  },
  get: function(id) {
    return DataStore.get(id);
  },
  add: function(element) {
    DataStore.add(element, Data.activeNode) && Data.publish('data:changed', this.getDocument());
  },
  remove: function(id) {
    DataStore.remove(id) && Data.publish('data:changed', this.getDocument());
  },
  clone: function(id) {
    DataStore.clone(id) && Data.publish('data:changed', this.getDocument());
  },
  parse: function(dataString) {
    return (new DOMParser()).parseFromString(dataString, 'text/xml');
  },
  mutate: function(element, silent) {
    DataStore.mutate(element) && true !== silent && Data.publish('data:changed', this.getDocument());
  },
  move: function(id, beforeId) {
    DataStore.move(id, beforeId) && Data.publish('data:changed', this.getDocument());
  },
  moveTo: function(srcElId, nextElId, parentId) {
    DataStore.moveTo(srcElId, nextElId, parentId) && Data.publish('data:changed', this.getDocument());
  }
};

vcCake.addService('data', Data);