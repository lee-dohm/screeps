const Behavior = require("./behavior")
const debug = require("./debug")

/**
 * Deposits the energy it carries in structures that can use energy.
 */
class UpgradeBehavior extends Behavior {
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
      if (this.creep.upgradeController(this.creep.target) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(this.creep.target)
      }
    }
  }

  findNextTarget() {
    const targets = this.creep.room.find(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_CONTROLLER
    })

    this.creep.target = targets[0]
  }
}

UpgradeBehavior.id = "upgrading"

module.exports = UpgradeBehavior
