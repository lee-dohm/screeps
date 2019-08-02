class HarvestBehavior {
  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isFull()
  }

  run() {
    if (!this.creep.target) {
      this.findNextTarget()
    } else {
      if (this.creep.harvest(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    return this.creep.pos.findClosestByRange(this.creep.room.sources)
  }
}

HarvestBehavior.mode = "harvesting"

module.exports = HarvestBehavior
