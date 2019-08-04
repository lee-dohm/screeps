const InvalidRoleError = require("./invalid-role-error")
const HarvesterRole = require("./harvester-role")

function roleFactory(creep) {
  switch (creep.memory.roleId) {
    case HarvesterRole.id: {
      return new HarvesterRole(creep)
    }

    default: {
      throw new InvalidRoleError(creep, creep.memory.roleId)
    }
  }
}

module.exports = roleFactory
