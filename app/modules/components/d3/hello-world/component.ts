import Component from '@glimmer/component';
import { action } from '@ember/object';
import {select} from 'd3-selection';

interface D3HelloWorldArgs {}

export default class D3HelloWorld extends Component<D3HelloWorldArgs> {
    @action
    hello() {
        select(".d3-hello").text("HELLOWORLD BY D3")
    }
}
