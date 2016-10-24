QUnit.test('framework test', assert => assert.ok(window.app, 'Framework loaded!'))

QUnit.test('test getService', assert => {
  assert.ok(typeof window.app.getService === 'function')
})

QUnit.test('test getService cook', assert => {
  var cook = window.app.getService('cook')
  assert.ok(_.isObject(cook))
})

QUnit.test('test getService cook element settings', assert => {
  var cook = window.app.getService('cook')
  var elements = cook.list.settings()
  assert.ok(_.isObject(elements))
  assert.ok(!_.isEmpty(elements))
})
