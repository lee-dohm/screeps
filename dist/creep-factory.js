const InvalidRoleError = require("./invalid-role-error")
const HarvesterCreep = require("./harvester-creep")

/**
 * Builds the appropriate creep for the role defined in the creep's memory.
 *
 * Returns the creep if the role is valid and the creep is not still spawning. Returns `undefined`
 * if the creep is still spawning.
 *
 * Throws `InvalidRoleError` if the creep's role is invalid.
 */
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
