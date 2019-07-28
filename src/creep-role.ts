import HarvesterRole from "./harvester-role"

export default abstract class CreepRole {
  creep: Creep

  constructor(creep: Creep) {
    this.creep = creep
  }

  get mode(): string {
    return this.creep.memory.mode
  }

  set mode(newMode: string) {
    this.creep.memory.mode = newMode
  }

  abstract run(): void
}
