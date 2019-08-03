const Body = require("./body")
const behaviorFactory = require("./behavior-factory")
const debug = require("./debug")
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
 * @property {Behavior} behavior Behavior governing the creep's actions
 * @property {Role} role Immutable role that the creep fulfills in the robot army
 * @property {Object} target Object that the creep has targeted for its current behavior
 */

Object.defineProperty(
  Creep.prototype,
  "behavior",
  defineProperty({
    get: function() {
      if (!this._behavior) {
        this._behavior = behaviorFactory(this)
      }

      return this._behavior
    },

    set: function(id) {
      this.memory.behaviorId = id

      this._behavior = behaviorFactory(this)
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
          this._target = Game.getObjectById(this.memory.targetId)
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

/**
 * Clears the creep's current target.
 */
Creep.prototype.clearTarget = function() {
  this.target = null
}

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
 * Executes the creep's behavior actions.
 *
 * First checks to see if the current behavior's goals are complete, if so, it transitions to the
 * next appropriate behavior. If the behavior's goals are not complete, it executes the behavior's
 * actions.
 */
Creep.prototype.run = function() {
  if (this.behavior.isComplete()) {
    this.behavior.setNextBehavior()
  } else {
    this.behavior.run()
  }
}
