const Body = require("./body")
const CreepBase = require("./creep-base")

const BEHAVIOR_TRANSITIONS = {
  gathering: "depositing",
  depositing: "gathering"
}

const BODY_DEFINITIONS = [
  [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]
]

class GathererCreep extends CreepBase {
  constructor(creep) {
    this.behaviorTransitions = BEHAVIOR_TRANSITIONS
    this.bodyDefinitions = BODY_DEFINITIONS
    this.defaultMode = "gathering"

    super(creep)
  }

  getBestBody(energyCapacity) {
    return this.bodyDefinitions.find(parts => {
      const body = new Body(parts)

      return energyCapacity > body.getCost()
    })
  }
}

module.exports = GathererCreep
