const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: UpgradeBehavior.id,
  [UpgradeBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, MOVE, WORK, WORK], [CARRY, MOVE, MOVE, WORK]]

/**
 * Defines a room controller upgrader.
 */
class UpgraderRole extends Role {
  constructor(creep) {
    super(creep, HarvestBehavior.id, BEHAVIOR_TRANSITIONS, BODY_DEFINITIONS)
  }

  /**
   * Clears the current target before setting the next behavior.
   */
  setNextBehavior() {
    this.creep.clearTarget()

    super.setNextBehavior()
  }
}

UpgraderRole.id = "upgrader"

module.exports = UpgraderRole
