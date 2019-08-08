"use strict"

const Behavior = require("./behavior")
const debug = require("./debug")

/**
 * Uses the energy it carries to construct things.
 */
class BuildBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Returns `true` if the creep is empty.
   */
  isComplete() {
    return this.creep.isEmpty()
  }

  /**
   * Moves to the current target and builds it.
   *
   * If there is no target set, it finds the nearest incomplete construction site and builds it.
   */
  run() {
    if (!this.creep.target) {
      this.findNextTarget()
    } else {
      if (this.creep.build(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    return this.creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
  }
}

BuildBehavior.id = "building"

module.exports = BuildBehavior