"use strict"

const BuilderRole = require("./builder-role")
const InvalidRoleError = require("./invalid-role-error")
const HarvesterRole = require("./harvester-role")
const UpgraderRole = require("./upgrader-role")

function roleFactory(creep) {
  switch (creep.memory.roleId) {
    case BuilderRole.id: {
      return new BuilderRole(creep)
    }

    case HarvesterRole.id: {
      return new HarvesterRole(creep)
    }

    case UpgraderRole.id: {
      return new UpgraderRole(creep)
    }

    default: {
      throw new InvalidRoleError(creep, creep.memory.roleId)
    }
  }
}

module.exports = roleFactory
