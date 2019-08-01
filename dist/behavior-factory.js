const DepositBehavior = require("./deposit-behavior")
const GatherBehavior = require("./gather-behavior")

class InvalidBehaviorError {
  constructor(creep, mode) {
    this.name = "InvalidBehaviorError"
    this.message = `Creep ${creep.name} requested an invalid behavior ${mode}`
    this.stack = new Error().stack
  }
}

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
