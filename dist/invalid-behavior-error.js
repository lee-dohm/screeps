class InvalidBehaviorError {
  constructor(creep, mode) {
    this.name = "InvalidBehaviorError"
    this.message = `Creep ${creep.name} requested an invalid behavior ${mode}`
    this.stack = new Error().stack
  }
}

module.exports = InvalidBehaviorError
