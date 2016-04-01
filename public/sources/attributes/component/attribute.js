import vcCake from 'vc-cake';
import Component from './Component';
import getter from './getter';
import setter from './setter';
var attributeService = vcCake.getService('attributes');

attributeService.add('component', Component, {
  setter: setter,
  getter: getter
});