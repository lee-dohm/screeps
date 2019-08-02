const debug = require("./debug")

class HarvestBehavior {
  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isFull()
  }

  run() {
    if (!this.creep.target) {
      this.creep.target = this.findNextTarget()
    } else {
      debug.log(`Creep ${this.creep.name}: harvest`)
      if (this.creep.harvest(this.creep.target) == ERR_NOT_IN_RANGE) {
        debug.log(`Creep ${this.creep.name}: moveTo`)
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    return this.creep.pos.findClosestByRange(Object.values(this.creep.room.sources))
  }
}

HarvestBehavior.mode = "harvesting"

module.exports = HarvestBehavior
