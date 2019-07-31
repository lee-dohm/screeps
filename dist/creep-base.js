const buildBehavior = require("./behavior-factory")

function InvalidTargetError(creep, target) {
  this.name = "InvalidTargetError"
  this.message = `Creep ${creep.name} attempted to set an invalid target: ${JSON.stringify(target)}`
  this.stack = new Error().stack
}

function NoBehaviorTransitionsError(creep) {
  this.name = "NoBehaviorTransitionsError"
  this.message = `Creep ${creep.name} has no behavior transitions defined`
  this.stack = new Error().stack
}

function NoBodyDefinitionsError(creep) {
  this.name = "NoBodyDefinitionsError"
  this.message = `Creep ${creep.name} has no body definitions defined`
  this.stack = new Error().stack
}

function NoDefaultModeError(creep) {
  this.name = "NoDefaultModeError"
  this.message = `Creep ${creep.name} has no default mode defined`
  this.stack = new Error().stack
}

class CreepBase {
  constructor(creep) {
    if (!this.defaultMode) {
      throw new NoDefaultModeError(creep)
    }

    if (!this.behaviorTransitions) {
      throw new NoBehaviorTransitionsError(creep)
    }

    if (!this.bodyDefinitions) {
      throw new NoBodyDefinitionsError(creep)
    }

    if (!this.creep.memory.mode) {
      this.creep.memory.mode = this.defaultMode
    }

    this.creep = creep
  }

  get mode() {
    return this.creep.memory.mode
  }

  set mode(newMode) {
    this.creep.memory.mode = newMode
  }

  get target() {
    return Game.getObjectById(this.creep.memory.targetId)
  }

  set target(target) {
    if (!target) {
      this.creep.memory.targetId = null
    } else if (target.id) {
      this.creep.memory.targetId = target.id
    } else {
      throw new InvalidTargetError(this.creep, target)
    }
  }

  setNextMode() {
    this.mode = this.behaviorTransitions[this.mode]
  }

  run() {
    const behavior = buildBehavior(this)

    if (behavior.isComplete()) {
      this.setNextMode()
    } else {
      behavior.run()
    }
  }
}

module.exports = CreepBase
