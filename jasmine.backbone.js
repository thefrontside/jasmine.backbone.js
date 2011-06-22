
;(function() {

  function json(object) {
    return JSON.stringify(object)
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
      this.message = function() {
        var actual = json(this.actual)
        var expected = json(attributes)
        return [
          "expected model: " + actual + " to have at least these attributes: " + expected,
          "expected model: " + actual + " not to have any of the following attributes: " + expected
        ]
      }
      for (var key in attributes) {
        if (!hasMatchingAttribute(this.actual, key, attributes[key])) {
          return false
        }
      }
      function hasMatchingAttribute(object, key, value) {
        return (key in object && object[key] === value)
      }
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
      this.message = function() {
        return [
          "model: " + actual + " does not have exactly these attributes: " + expected,
          "model has exactly these attributes, but shouldn't :" +  expected
        ]
      }
      return jasmine.Env.prototype.equal_(this.actual.attributes, attributes, {},{})
    }
  }

  beforeEach(function() {
    this.addMatchers(ModelMatchers)
  })
})()