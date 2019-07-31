const Body = require("./body")
const buildBehavior = require("./behavior-factory")
const defineProperty = require("./define-property")

function InvalidTargetError(creep, target) {
  this.name = "InvalidTargetError"
  this.message = `Creep ${creep.name} attempted to set an invalid target: ${JSON.stringify(target)}`
  this.stack = new Error().stack
}

Object.defineProperty(
  Creep.prototype,
  "mode",
  defineProperty({
    get: function() {
      return this.memory.mode
    },

    set: function(newMode) {
      this.memory.mode = newMode
    }
  })
)

Object.defineProperty(
  Creep.prototype,
  "target",
  defineProperty({
    get: function() {
      return Game.getObjectById(this.memory.targetId)
    },

    set: function(newTarget) {
      if (!target) {
        this.memory.targetId = null
      } else if (target.id) {
        this.memory.targetId = target.id
      } else {
        throw new InvalidTargetError(this, target)
      }
    }
  })
)

Creep.prototype.getBestBody = function(energyCapacity) {
  return this.bodyDefinitions.find(parts => {
    const body = new Body(parts)

    return energyCapacity > body.getCost()
  })
}

Creep.prototype.isFull = function() {
  if (!this._isFull) {
    this._isFull = _.sum(this.carry) === this.carryCapacity
  }

  return this._isFull
}

Creep.prototype.run = function() {
  const behavior = buildBehavior(this)

  if (behavior.isComplete()) {
    this.setNextMode()
  } else {
    behavior.run()
  }
}

Creep.prototype.setNextMode = function() {
  this.mode = this.behaviorTransitions[this.mode]
}
