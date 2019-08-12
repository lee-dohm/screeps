"use strict"

const Body = require("./body")
const BootstrapHarvestBehavior = require("./bootstrap-harvest-behavior")
const DepositBehavior = require("./deposit-behavior")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [BootstrapHarvestBehavior.id]: DepositBehavior.id,
  [DepositBehavior.id]: BootstrapHarvestBehavior.id
}

const BODY_DEFINITIONS = [Body.parse("1c 2m 1w")]

/**
 * Defines an energy harvester to be spawned in order to bootstrap the robot army.
 */
class BootstrapHarvesterRole extends Role {
  constructor(creep) {
    super(creep, BootstrapHarvestBehavior.id, BEHAVIOR_TRANSITIONS)
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
