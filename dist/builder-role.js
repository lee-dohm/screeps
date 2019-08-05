"use strict"

const BuildBehavior = require("./build-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: BuildBehavior.id,
  [BuildBehavior.id]: HarvestBehavior.id,
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, WORK], [CARRY, MOVE, MOVE, MOVE, WORK, WORK]]

/**
 * Defines a creep that builds construction sites.
 */
class BuilderRole extends Role {
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

BuilderRole.bodyDefinitions = BODY_DEFINITIONS
BuilderRole.id = "builder"

module.exports = BuilderRole
