const Body = require("./body")
const buildBehavior = require("./behavior-factory")
const defineProperty = require("./define-property")

function InvalidTargetError(creep, target) {
  this.name = "InvalidTargetError"
  this.message = `Creep ${creep.name} attempted to set an invalid target: ${JSON.stringify(target)}`
  this.stack = new Error().stack
}

/**
 * Represents a creep in the game.
 *
 * @typedef {Object} Creep
 * @property {string} mode Current mode of the creep
 * @property {string} role Immutable role that the creep fulfills
 * @property {Object} target Object that the creep has targeted for its current mode
 */

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
  "role",
  defineProperty({
    get: function() {
      return this.memory.role
    }
  })
)

Object.defineProperty(
  Creep.prototype,
  "target",
  defineProperty({
    get: function() {
      if (!this._target) {
        if (this.memory.targetId) {
          this._target = Game.getObjectById(this.memory.target)
        } else {
          this._target = null
        }
      }

      return this._target
    },

    set: function(target) {
      if (!target) {
        this._target = this.memory.targetId = null
      } else if (target.id) {
        this.memory.targetId = target.id
        this._target = target
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

/**
 * Determines if the creep's `CARRY` modules are empty.
 */
Creep.prototype.isEmpty = function() {
  if (!this._isEmpty) {
    this._isEmpty = _.sum(this.carry) === 0
  }

  return this._isEmpty
}

/**
 * Determines if the creep's `CARRY` modules are full.
 */
Creep.prototype.isFull = function() {
  if (!this._isFull) {
    this._isFull = _.sum(this.carry) === this.carryCapacity
  }

  return this._isFull
}

/**
 * Executes the creep's currently assigned behavior.
 */
Creep.prototype.run = function() {
  const behavior = buildBehavior(this)

  if (behavior.isComplete()) {
    this.setNextMode()
  } else {
    behavior.run()
  }
}

/**
 * Transitions to the next behavior mode.
 */
Creep.prototype.setNextMode = function() {
  this.mode = this.behaviorTransitions[this.mode]
}
