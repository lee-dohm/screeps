const Behavior = require("./behavior")
const debug = require("./debug")

/**
 * Deposits the energy it carries in structures that can use energy.
 */
class DepositBehavior extends Behavior {
  constructor(creep) {
    super(creep)
  }

  /**
   * Returns `true` if the creep is empty.
   */
  isComplete() {
    return this.creep.isEmpty()
  }

  /**
   * Moves to the current target and deposits energy.
   *
   * If there is no target set, it finds the first energy-receiving structure and deposits energy.
   */
  run() {
    if (!this.creep.target) {
      this.findNextTarget()
    } else {
      const target = this.creep.target
      const amount = Math.min(target.energyCapacity - target.energy, _.sum(this.creep.carry))

      if (this.creep.transfer(target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(target)
      }
    }
  }

  findNextTarget() {
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

    this.creep.target = targets[0]
  }
}

DepositBehavior.id = "depositing"

module.exports = DepositBehavior
