const DepositBehavior = require("./deposit-behavior")
const GatherBehavior = require("./gather-behavior")
const InvalidBehaviorError = require("./invalid-behavior-error")

function buildBehavior(creep) {
  switch (creep.mode) {
    case DepositBehavior.mode: {
      return new DepositBehavior(creep)
    }

    case GathererBehavior.mode: {
      return new GatherBehavior(creep)
    }

    default: {
      if (creep.defaultMode) {
        creep.mode = creep.defaultMode

        return buildBehavior(creep)
      } else {
        throw new InvalidBehaviorError(creep, mode)
      }
    }
  }
}

module.exports = buildBehavior
