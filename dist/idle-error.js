"use strict"

class IdleError {
  constructor(creep, message) {
    this.name = "IdleError"
    this.message = `IDLE ${creep.name}: ${message}`
    this.stack = new Error().stack
    this.groupInterval = 30
  }
}

module.exports = IdleError
