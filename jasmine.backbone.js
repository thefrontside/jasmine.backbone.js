
;(function() {

  function json(object) {
    return JSON.stringify(object)
  }

  function msg(list) {
    return list.length !== 0 ? list.join(';') : ''
  }

  var ModelMatchers = {

    /**
    * Expect subject to have at least those attributes specified by `attributes`.
    * It can have extra attribuse
    * @eg
    *     var model = new Fruit({
    *       type: 'pear',
    *       color: 'green',
    *       texture: 'soft'
    *     })
    *
    *     //succeeds
    *     expect(model).toHaveAttributes({
    *       type: 'pear',
    *       texture: 'soft'
    *     })
    *     //fails
    *     expect(model).toHaveAttributes({
    *       type: 'pear',
    *       skin: 'rough'
    *     })
    */
    toHaveAttributes: function toHaveAttributes(attributes) {
      var keys = []
      var values = []
      jasmine.getEnv().equals_(this.actual.attributes, attributes, keys, values)
      var missing = []
      for (var i = 0; i < keys.length; i++) {
        var message = keys[i]
        if (message.match(/but missing from/)) {
          missing.push(keys[i])
        }
      }
      this.message = function() {
        return [
          "model should have at least these attributes(" + json(attributes) + ") " + msg(keys) + " " + msg(values),
          "model should have none of the following attributes(" + json(attributes) + ") " + msg(keys) + " " + msg(values)
        ]
      }
      return missing.length == 0  && values.length == 0
    },

    /**
    * Expect subject to have only and exactly attributes specified by `attributes`
    * @eg
    *     var model = Fruit({
    *       type: 'apple',
    *       skin: 'smooth'
    *     })
    *     //fails
    *     expect(model).toHaveExactlyTheseAttributes({
    *       type: 'apple'
    *     })
    */
    toHaveExactlyTheseAttributes: function toHaveExactlyTheseAttributes(attributes) {
      var keys = []
      var values = []
      var equal = jasmine.getEnv().equals_(this.actual.attributes, attributes, keys, values)
      this.message = function() {
        return [
          "model should match exact attributes, but does not. " + msg(keys) + " " + msg(values),
          "model has exactly these attributes, but shouldn't :" +  json(attributes)
        ]
      }
      return equal
    }
  }

  beforeEach(function() {
    this.addMatchers(ModelMatchers)
  })
})()