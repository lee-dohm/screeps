"use strict"

const Behavior = require("./behavior")
const debug = require("./debug")
const TargetSelector = require("./target-selector")

/**
 * Uses the energy it carries to construct or repair things.
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
        if (this.creep.target.hits == this.creep.target.hitsMax) {
          this.creep.target = this.findNextTarget()
        } else {
          this.repairStructure()
        }
      }
    }
  }

  buildConstructionSite() {
    if (this.creep.build(this.creep.target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.target)
    }
  }

  findNextTarget() {
    const selector = new TargetSelector(this.creep)

    // Select construction sites first
    selector.addRule(creep => creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES))

    // Then repair structures other than walls
    selector.addRule(creep =>
      creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: struct =>
          (struct.structureType == STRUCTURE_ROAD || struct.my) && struct.hits < struct.hitsMax
      })
    )

    // Then repair walls sorted by percentage of hits
    selector.addRule(creep =>
      creep.room
        .find(FIND_STRUCTURES, {
          filter: struct => struct.structureType == STRUCTURE_WALL && struct.hits < struct.hitsMax
        })
        .sort((a, b) => (a.hits / a.hitsMax < b.hits / b.hitsMax ? -1 : 1))
    )

    return selector.select()
  }

  fleeSources() {
    const sourcePos = this.creep.room.sources.map(source => source.pos)
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
