"use strict"

const Behavior = require("./behavior")
const debug = require("./debug")

/**
 * Harvests energy until the creep's `CARRY` parts are full.
 */
class HarvestBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Returns `true` when the creep is full.
   */
  isComplete() {
    return this.creep.isFull()
  }

  /**
   * Moves to the current target and harvests from it.
   *
   * If there is no target set, it finds the closest energy source in the room the creep is in.
   */
  run() {
    if (!this.creep.target) {
      this.creep.target = this.findNextTarget()
    } else {
      if (this.creep.harvest(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    const sources = Object.values(this.creep.room.sources)
    const targets = this.createWeightedTargetList(sources)
    const targetId = targets[Math.floor(Math.random() * targets.length)]

    return Game.getObjectById(targetId)
  }

  createWeightedTargetList(sources) {
    let list = []

    for (const source of sources) {
      for (let i = 0; i < source.getHarvestablePositions().length; i++) {
        list.push(source.id)
      }
    }

    return list
  }
}

HarvestBehavior.id = "harvesting"

module.exports = HarvestBehavior
