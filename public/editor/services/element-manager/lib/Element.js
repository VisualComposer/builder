import {getService} from 'vc-cake';
import {buildAttributes} from './tools';

const documentManager = getService('document-manager');

export default class Element {
  constructor(id) {
    let element = documentManager.get(id);
    if('object' !== typeof element) {
      throw new Error('Wrong element id');
    }
    this.element = buildAttributes(element);
  }
}