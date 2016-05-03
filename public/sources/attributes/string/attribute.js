import {getService} from 'vc-cake';
import Component from './Component';
var attributeService = getService('cook').attributes;

attributeService.add('string', Component);