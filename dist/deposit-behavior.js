class DepositBehavior {
  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isEmpty()
  }

  run() {
    if (!this.creep.target) {
      this.findNextTarget()
    } else {
      const target = this.creep.target
      const amount = target.energyCapacity - target.energy

      if (this.creep.transfer(target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target)
      }
    }
  }

  findNextTarget() {
    let targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.energy < structure.energyCapacity
        )
      }
    })

    this.creep.target = targets[0]
  }
}

DepositBehavior.mode = "depositing"

module.exports = DepositBehavior
