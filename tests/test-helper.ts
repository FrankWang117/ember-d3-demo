import Application from 'ember-d3-demo/app';
import config from 'ember-d3-demo/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
