const DepositBehavior = require("./deposit-behavior")
const HarvestBehavior = require("./harvest-behavior")
const InvalidBehaviorError = require("./invalid-behavior-error")

function behaviorFactory(creep) {
  switch (creep.memory.behaviorId) {
    case DepositBehavior.id: {
      return new DepositBehavior(creep)
    }

    case HarvestBehavior.id: {
      return new HarvestBehavior(creep)
    }

    default: {
      throw new InvalidBehaviorError(creep, mode)
    }
  }
}

module.exports = behaviorFactory
