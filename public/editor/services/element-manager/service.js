import vcCake from 'vc-cake';
import Element from 'lib/Element';

vcCake.addService('element-manager', {
  get: function(element) {
    return new Element(element);
  }
});