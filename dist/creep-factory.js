const BuilderRole = require("./builder-role")
const GathererCreep = require("./gatherer-creep")
const HarvesterCreep = require("./harvester-creep")
const UpgraderRole = require("./upgrader-role")

function buildCreep(name) {
  const creep = Game.creeps[name]

  if (creep) {
    switch (creep.memory.role) {
      case "builder": {
        return new BuilderRole(creep)
      }

      case GathererCreep.role: {
        return new GathererCreep(creep)
      }

      case HarvesterCreep.role: {
        return new HarvesterCreep(creep)
      }

      case "upgrader": {
        return new UpgraderRole(creep)
      }

      default: {
        console.log(`ERROR: Unknown creep role for ${name}: ${JSON.stringify(creep.memory)}`)
        return undefined
      }
    }
  }
}

module.exports = buildCreep
