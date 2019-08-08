"use strict"

const BootstrapHarvesterRole = require("./bootstrap-harvester-role")
const BuilderRole = require("./builder-role")
const InvalidRoleError = require("./invalid-role-error")
const HarvesterRole = require("./harvester-role")
const UpgraderRole = require("./upgrader-role")

function roleFactory(creep) {
  switch (creep.memory.roleId) {
    case BootstrapHarvesterRole.id: {
      return new BootstrapHarvesterRole(creep)
    }

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
