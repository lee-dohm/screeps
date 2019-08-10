const AttackBehavior = require("./attack-behavior")
const Body = require("./body")
const Role = require("./role")

const BEHAVIOR_TRANSITIONS = {
  [AttackBehavior.id]: AttackBehavior.id
}

const BODY_DEFINITIONS = [
  Body.parse("2a 2m"),
  Body.parse("2a 4m 2t"),
  Body.parse("4a 8m 4t"),
  Body.parse("6a 12m 6t")
]

/**
 * An attack creep.
 */
class SoldierRole extends Role {
  constructor(creep) {
    super(creep, AttackBehavior.id, BEHAVIOR_TRANSITIONS)
  }
}

SoldierRole.bodyDefinitions = BODY_DEFINITIONS
SoldierRole.id = "soldier"

module.exports = SoldierRole
