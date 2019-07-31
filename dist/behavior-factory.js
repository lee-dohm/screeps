const DepositBehavior = require("./deposit-behavior")
const GatherBehavior = require("./gather-behavior")

function InvalidBehaviorError(creep, mode) {
  this.name = "InvalidBehaviorError"
  this.message = `Creep ${creep.name} requested an invalid behavior ${mode}`
  this.stack = new Error().stack
}

function buildBehavior(creep) {
  switch (creep.mode) {
    case "depositing": {
      return new DepositBehavior(creep)
    }

    case "gathering": {
      return new GatherBehavior(creep)
    }

    default: {
      throw new InvalidBehaviorError(creep, mode)
    }
  }
}

module.exports = buildBehavior
