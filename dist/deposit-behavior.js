const { energyDeficit } = require("./utility")

/**
 * Defines the behavior of depositing carried energy until empty.
 */
class DepositBehavior {
  static mode = "depositing"

  constructor(creep) {
    this.creep = creep
  }

  isComplete() {
    return this.creep.isEmpty()
  }

  run() {
    if (!this.target) {
      this.target = this.findNextEnergyStructure()
    } else {
      const amount = energyDeficit(this.target)

      if (this.creep.transfer(this.target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.target)
      }
    }
  }

  findNextEnergyStructure() {
    const targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.energy < structure.energyCapacity
        )
      }
    })

    const highestEnergyDeficit = targets.sort((a, b) => energyDeficit(b) - energyDeficit(a)).pop()

    return highestEnergyDeficit
  }
}

module.exports = DepositBehavior
