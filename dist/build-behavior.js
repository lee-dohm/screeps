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
   * Moves to the current target and builds or repairs it.
   *
   * If there is no target set, it finds the nearest incomplete construction site or damaged
   * structure.
   */
  run() {
    if (!this.creep.target) {
      const target = this.findNextTarget()

      if (target) {
        this.creep.target = target
      } else {
        this.fleeSources()
      }
    } else {
      if (this.creep.target instanceof ConstructionSite) {
        this.buildConstructionSite()
      } else {
        this.repairStructure()
      }
    }
  }

  buildConstructionSite() {
    if (this.creep.build(this.creep.target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.target)
    }
  }

  findNextTarget() {
    const target =
      this.creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES) ||
      this.creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
        filter: struct => struct.hits < struct.hitsMax
      })

    return target
  }

  fleeSources() {
    const sourcePos = Object.values(this.creep.room.sources).map(source => source.pos)
    this.creep.flee(sourcePos, 3)
  }

  repairStructure() {
    if (this.creep.repair(this.creep.target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.target)
    }
  }
}

BuildBehavior.id = "building"

module.exports = BuildBehavior
