const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: DepositBehavior.id,
  [DepositBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, MOVE, WORK, WORK], [CARRY, MOVE, MOVE, WORK]]

class HarvesterRole extends Role {
  constructor(creep) {
    super(creep, HarvestBehavior.id, BEHAVIOR_TRANSITIONS, BODY_DEFINITIONS)
  }

  setNextBehavior() {
    this.creep.clearTarget()

    super.setNextBehavior()
  }
}

HarvesterRole.id = "harvester"

module.exports = HarvesterRole
