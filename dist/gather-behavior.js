const { energyDeficit } = require("./utility")

class GatherBehavior {
  constructor(creepBase) {
    this.creepBase = creepBase
  }

  isComplete() {
    const creep = this.creepBase.creep

    return creep.carry.energy == creep.carryCapacity
  }

  run() {
    if (!this.target) {
      this.target = this.findNextEnergy()
    } else {
      if (this.creepBase.creep.harvest(this.target) == ERR_NOT_IN_RANGE) {
        this.creepBase.creep.moveTo(this.target)
      }
    }
  }

  findNextEnergy() {
    const creep = this.creepBase.creep
    const pos = creep.pos

    return pos.findClosestByRange(FIND_DROPPED_ENERGY)
  }
}

module.exports = GatherBehavior
