"use strict"

class InvalidTargetError {
  constructor(creep, target) {
    this.name = "InvalidTargetError"
    this.message = `Creep ${creep.name} attempted to set an invalid target: ${JSON.stringify(
      target
    )}`
    this.stack = new Error().stack
  }
}

module.exports = InvalidTargetError
