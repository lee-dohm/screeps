class InvalidRoleError {
  constructor(name, role) {
    this.name = "InvalidRoleError"
    this.message = `Creep ${name} has an invalid role: ${JSON.stringify(role)}`
    this.stack = new Error().stack
  }
}

module.exports = InvalidRoleError
