/**
 * Defines the behavior of gathering dropped energy until the creep is full.
 */
class GatherBehavior {
  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isFull()
  }

  run() {
    if (!this.target) {
      this.target = this.findNextEnergy()
    } else {
      if (this.creep.harvest(this.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.target)
      }
    }
  }

  findNextEnergy() {
    const pos = this.creep.pos

    return pos.findClosestByRange(FIND_DROPPED_ENERGY)
  }
}

module.exports = GatherBehavior
