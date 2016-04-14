import vcCake from 'vc-cake';
import Element from 'lib/Element';
class ElementManager {
  constructor(id) {
    this.element = new Element(id);
  }
}
vcCake.addService('element-manager', ElementManager);