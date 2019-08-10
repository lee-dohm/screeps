"use strict"

const Body = require("./body")
const CheckSignBehavior = require("./check-sign-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")
const UpgradeBehavior = require("./upgrade-behavior")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: UpgradeBehavior.id,
  [UpgradeBehavior.id]: CheckSignBehavior.id,
  [CheckSignBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [
  Body.parse("1c 2m 1w"),
  Body.parse("1c 4m 3w"),
  Body.parse("2c 6m 4w"),
  Body.parse("7c 11m 4w")
]

/**
 * Defines a room controller upgrader.
 */
class UpgraderRole extends Role {
  constructor(creep) {
    super(creep, HarvestBehavior.id, BEHAVIOR_TRANSITIONS)
  }

  /**
   * Clears the current target and the `mySign` check before setting the next behavior.
   */
  setNextBehavior() {
    this.creep.clearTarget()
    delete this.creep.memory.mySign

    super.setNextBehavior()
  }
}

UpgraderRole.bodyDefinitions = BODY_DEFINITIONS
UpgraderRole.id = "upgrader"

module.exports = UpgraderRole
