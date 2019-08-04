class InvalidRoleError {
  constructor(creep, role) {
    this.name = "InvalidRoleError"
    this.message = `Creep ${creep.name} has an invalid role: ${JSON.stringify(role)}`
    this.stack = new Error().stack
  }
}

module.exports = InvalidRoleError
