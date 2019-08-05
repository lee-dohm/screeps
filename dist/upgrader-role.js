"use strict"

const CheckSignBehavior = require("./check-sign-behavior")
const HarvestBehavior = require("./harvest-behavior")
const Role = require("./role")
const UpgradeBehavior = require("./upgrade-behavior")

const BEHAVIOR_TRANSITIONS = {
  [HarvestBehavior.id]: UpgradeBehavior.id,
  [UpgradeBehavior.id]: CheckSignBehavior.id,
  [CheckSignBehavior.id]: HarvestBehavior.id
}

const BODY_DEFINITIONS = [[CARRY, MOVE, MOVE, WORK], [CARRY, MOVE, MOVE, MOVE, WORK, WORK]]

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
