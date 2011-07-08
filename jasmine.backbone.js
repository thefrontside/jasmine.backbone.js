
;(function() {

  function json(object) {
    return JSON.stringify(object)
  }

  function msg(list) {
    return list.length !== 0 ? list.join(';') : ''
  }

  function eventBucket(model, eventName) {
    var spiedEvents = model.spiedEvents
    if (!spiedEvents) {
      spiedEvents = model.spiedEvents = {}
    }
    var bucket = spiedEvents[eventName]
    if (!bucket) {
      bucket = spiedEvents[eventName] = []
    }
    return bucket
  }

  triggerSpy(Backbone.Model)
  triggerSpy(Backbone.Collection)

  function triggerSpy(constructor) {
    var trigger = constructor.prototype.trigger
    constructor.prototype.trigger = function(eventName) {
      var bucket = eventBucket(this, eventName)
      bucket.push(Array.prototype.slice.call(arguments, 1))
      return trigger.apply(this, arguments)
    }
  }

  var EventMatchers = {

    /**
    * Expect this Model or Collection to have received the event
    * specified by `eventName` at some point prior to now.
    * If arguments are passed, then those arguments will be
    * expected as well. Otherwise, it will merely check to see
    * that the event has been called.
    *
    * @param [String] eventName the event type. eg 'save', 'error'
    * @params *[Object] arguments the event arguments to be expected
    */
    toHaveTriggered: function toHaveTriggered(eventName) {
      var bucket = eventBucket(this.actual, eventName)
      var triggeredWith = Array.prototype.slice.call(arguments, 1)
      this.message = function () {
        return [
          "expected model or collection to have received '" + eventName + "' with " + json(triggeredWith),
          "expected model not to have received event '" + eventName + "', but it did"
        ]
      }
      return _.detect(bucket, function(args) {
        if (triggeredWith.length == 0) {
          return true
        } else {
          return jasmine.getEnv().equals_(triggeredWith, args)
        }
      })
    }
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
          "model should have at least these attributes(" + json(attributes) + ") " + msg(missing) + " " + msg(values),
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
    this.addMatchers(EventMatchers)
  })
})()