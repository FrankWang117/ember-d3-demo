import Component from '@glimmer/component';
import D3Component from 'ember-d3-demo/utils/d3/d3Component';
import { action } from '@ember/object';
import { select } from 'd3-selection';

interface D3ScaleArgs {}

export default class D3Scale extends D3Component<D3ScaleArgs> {
    @action
    initScale() {
        
    }
}
