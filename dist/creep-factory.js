const InvalidRoleError = require("./invalid-role-error")
const HarvesterCreep = require("./harvester-creep")

function buildCreep(name) {
  const creep = Game.creeps[name]

  if (creep && !creep.spawning) {
    switch (creep.memory.role) {
      case HarvesterCreep.role: {
        return new HarvesterCreep(creep)
      }

      default: {
        throw new InvalidRoleError(name, creep.memory.role)
      }
    }
  }
}

module.exports = buildCreep
