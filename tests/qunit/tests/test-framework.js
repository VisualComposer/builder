QUnit.test("framework test", function(assert) {
  assert.ok(window.sw_app, "Framework loaded!");
  assert.equal(typeof window.sw_app(), 'object', "Framework type object");
  assert.equal(window.sw_app().data(123), 123, "Framework helpers exists");
});