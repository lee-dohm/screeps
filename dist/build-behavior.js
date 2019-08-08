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
    const targets = this.creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)

    if (!targets || targets.length === 0) {
      const sourcePos = Object.values(this.creep.room.sources).map(source => source.pos)
      this.creep.flee(sourcePos, 3)
    } else {
      this.creep.target = targets[0]
    }
  }
}

BuildBehavior.id = "building"

module.exports = BuildBehavior
