const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: DepositBehavior.id,
  [DepositBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, MOVE, WORK, WORK], [CARRY, MOVE, MOVE, WORK]]

/**
 * Defines an energy harvester.
 */
class HarvesterRole extends Role {
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

HarvesterRole.bodyDefinitions = BODY_DEFINITIONS
HarvesterRole.id = "harvester"

module.exports = HarvesterRole
