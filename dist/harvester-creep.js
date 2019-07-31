const CreepBase = require("./creep-base")

const BEHAVIOR_TRANSITIONS = {}

const BODY_DEFINITIONS = [
  [WORK, WORK, WORK, WORK, MOVE, MOVE],
  [WORK, WORK, MOVE, MOVE]
]

class HarvesterCreep extends CreepBase {
  constructor(creep) {
    this.behaviorTransitions = BEHAVIOR_TRANSITIONS
    this.bodyDefinitions = BODY_DEFINITIONS
    this.defaultMode = "harvesting"

    super(creep.id)
  }
}

module.exports = HarvesterCreep
