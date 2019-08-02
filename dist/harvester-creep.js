const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.mode]: DepositBehavior.mode,
  [DepositBehavior.mode]: HarvestBehavior.mode
}

const BODY_DEFINITIONS = [[WORK, WORK, WORK, WORK, MOVE, MOVE], [WORK, MOVE, MOVE, CARRY]]

class HarvesterCreep extends Creep {
  constructor(creep) {
    super(creep.id)

    creep.behaviorTransitions = BEHAVIOR_TRANSITIONS
    creep.bodyDefinitions = BODY_DEFINITIONS
    creep.defaultMode = HarvestBehavior.mode
  }
}

HarvesterCreep.role = "harvester"

module.exports = HarvesterCreep
