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
    return this.creep.pos.findClosestByRange(Object.values(this.creep.room.sources))
  }
}

HarvestBehavior.id = "harvesting"

module.exports = HarvestBehavior
