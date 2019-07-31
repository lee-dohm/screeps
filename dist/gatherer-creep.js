const BEHAVIOR_TRANSITIONS = {
  gathering: "depositing",
  depositing: "gathering"
}

const BODY_DEFINITIONS = [
  [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
]

class GathererCreep extends Creep {
  constructor(creep) {
    this.behaviorTransitions = BEHAVIOR_TRANSITIONS
    this.bodyDefinitions = BODY_DEFINITIONS
    this.defaultMode = "gathering"

    super(creep.id)
  }
}

module.exports = GathererCreep
