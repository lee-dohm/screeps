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

  /**
   * Checks the current mode and state to determine if a mode switch needs to occur.
   */
  abstract checkMode(): void

  /**
   * Executes the instructions for the current mode.
   */
  abstract runMode(): void

  run() {
    this.checkMode()
    this.runMode()
  }
}
