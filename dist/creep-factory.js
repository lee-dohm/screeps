const InvalidRoleError = require("./involid-role-error")
const HarvesterCreep = require("./harvester-creep")

function buildCreep(name) {
  const creep = Game.creeps[name]

  if (creep) {
    switch (creep.memory.role) {
      case HarvesterCreep.role: {
        return new HarvesterCreep(creep)
      }

      default: {
        throw new InvalidRoleError(name, role)
      }
    }
  }
}

module.exports = buildCreep
