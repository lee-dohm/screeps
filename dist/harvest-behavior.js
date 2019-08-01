class HarvestBehavior {
  static mode = "harvesting"

  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return false
  }

  run() {
    if (!this.creep.target) {
    } else if (this.creep.harvest(this.creep.target) == ERR_NOT_IN_RANGE) {
      this.creep.moveTo(this.creep.target)
    }
  }
}

module.exports = HarvestBehavior
