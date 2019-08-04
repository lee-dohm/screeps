"use strict"

const CheckSignBehavior = require("./check-sign-behavior")
const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const InvalidBehaviorError = require("./invalid-behavior-error")
const UpgradeBehavior = require("./upgrade-behavior")

function behaviorFactory(creep) {
  switch (creep.memory.behaviorId) {
    case CheckSignBehavior.id: {
      return new CheckSignBehavior(creep)
    }

    case DepositBehavior.id: {
      return new DepositBehavior(creep)
    }

    case HarvestBehavior.id: {
      return new HarvestBehavior(creep)
    }

    case UpgradeBehavior.id: {
      return new UpgradeBehavior(creep)
    }

    default: {
      throw new InvalidBehaviorError(creep, creep.memory.behaviorId)
    }
  }
}

module.exports = behaviorFactory
