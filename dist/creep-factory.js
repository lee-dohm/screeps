const BuilderRole = require("./builder-role")
const CreepRole = require("./creep-role")
const HarvesterRole = require("./harvester-role")

function buildCreep(name) {
  const creep = Game.creeps[name]

  if (creep) {
    switch (creep.memory.role) {
      case "builder": {
        return new BuilderRole(creep)
      }

      case "harvester": {
        return new HarvesterRole(creep)
      }

      default: {
        console.log(`ERROR: Unknown creep role for ${name}: ${JSON.stringify(creep.memory)}`)
        return undefined
      }
    }
  }
}

module.exports = buildCreep
