const { energyDeficit } = require("./utility")

class DepositBehavior {
  constructor(creepBase) {
    this.creepBase = creepBase
  }

  isComplete() {
    const creep = this.creepBase.creep

    return creep.carry.energy == 0
  }

  run() {
    const creep = this.creepBase.creep

    if (!this.target) {
      this.target = this.findNextEnergyStructure()
    } else {
      const amount = energyDeficit(this.target)

      if (creep.transfer(this.target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
        creep.moveTo(this.target)
      }
    }
  }

  findNextEnergyStructure() {
    const creep = this.creepBase.creep
    const targets = creep.room.find(FIND_STRUCTURES, {
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
