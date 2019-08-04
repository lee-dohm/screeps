const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")
const UpgradeBehavior = require("./upgrade-behavior")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: UpgradeBehavior.id,
  [UpgradeBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, WORK], [CARRY, MOVE, MOVE, MOVE, WORK, WORK]]

/**
 * Defines a room controller upgrader.
 */
class UpgraderRole extends Role {
  constructor(creep) {
    super(creep, HarvestBehavior.id, BEHAVIOR_TRANSITIONS)
  }

  /**
   * Clears the current target before setting the next behavior.
   */
  setNextBehavior() {
    this.creep.clearTarget()

    super.setNextBehavior()
  }
}

UpgraderRole.bodyDefinitions = BODY_DEFINITIONS
UpgraderRole.id = "upgrader"

module.exports = UpgraderRole
