"use strict"

const Body = require("./body")
const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: DepositBehavior.id,
  [DepositBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [
  Body.parse("1c 2m 1w"),
  Body.parse("1c 4m 3w"),
  Body.parse("2c 6m 4w"),
  Body.parse("7c 11m 4w")
]

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
