"use strict"

const Body = require("./body")
const BuildBehavior = require("./build-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: BuildBehavior.id,
  [BuildBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [Body.parse("1c 2m 1w"), Body.parse("1c 4m 3w"), Body.parse("2c 6m 4w")]

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
