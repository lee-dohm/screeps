import CreepRole from "./creep-role"
import HarvesterRole from "./harvester-role"

export default function buildCreep(name: string): CreepRole | undefined {
  const creep = Game.creeps[name]

  if (creep) {
    switch (creep.memory.role) {
      case "harvester": {
        return new HarvesterRole(creep)
      }

      default: {
        console.error(`Unknown creep role for ${name}: ${JSON.stringify(creep.memory)}`)
        return undefined
      }
    }
  }
}
