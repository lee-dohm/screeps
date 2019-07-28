import HarvesterRole from "./harvester-role"

export default abstract class CreepRole {
  creep: Creep

  constructor(creep: Creep) {
    this.creep = creep
  }

  static buildCreep(name: string): CreepRole | undefined {
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

  get mode(): string {
    return this.creep.memory.mode
  }

  set mode(newMode: string) {
    this.creep.memory.mode = newMode
  }

  abstract run(): void
}
