"use strict"

const Body = require("./body")
const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: DepositBehavior.id,
  [DepositBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [Body.parse("1c 2m 1w")]

/**
 * Defines an energy harvester to be spawned in order to bootstrap the robot army.
 */
class BootstrapHarvesterRole extends Role {
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

BootstrapHarvesterRole.bodyDefinitions = BODY_DEFINITIONS
BootstrapHarvesterRole.id = "bootstrap harvester"

module.exports = BootstrapHarvesterRole
