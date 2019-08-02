const debug = require("./debug")

class HarvestBehavior {
  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isFull()
  }

  run() {
    debug.log("Begin HarvestBehavior.run()")

    if (!this.creep.target) {
      this.creep.target = this.findNextTarget()
    } else {
      if (this.creep.harvest(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }

    debug.log("End HarvestBehavior.run()")
  }

  findNextTarget() {
    return this.creep.pos.findClosestByRange(this.creep.room.sources)
  }
}

HarvestBehavior.mode = "harvesting"

module.exports = HarvestBehavior
