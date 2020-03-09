import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | d3/hello', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:d3/hello');
    assert.ok(route);
  });
});
