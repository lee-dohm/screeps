const CreepBase = require("./creep-base")
const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.mode]: DepositBehavior.mode,
  [DepositBehavior.mode]: HarvestBehavior.mode
}

const BODY_DEFINITIONS = [[WORK, WORK, WORK, WORK, MOVE, MOVE], [WORK, MOVE, MOVE, CARRY]]

class HarvesterCreep extends Creep {
  static role = "harvester"

  constructor(creep) {
    super(creep.id)

    this.behaviorTransitions = BEHAVIOR_TRANSITIONS
    this.bodyDefinitions = BODY_DEFINITIONS
    this.defaultMode = HarvestBehavior.mode
  }
}

module.exports = HarvesterCreep
