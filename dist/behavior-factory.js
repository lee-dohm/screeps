const InvalidBehaviorError = require("./invalid-behavior-error")

function buildBehavior(creep) {
  switch (creep.mode) {
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
