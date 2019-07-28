class CreepRole {
  creep: Creep

  constructor(creep: Creep) {
    this.creep = creep
  }

  get mode() {
    return this.creep.memory.mode
  }

  set mode(newMode) {
    this.creep.memory.mode = newMode
  }

  run() {
    this.checkMode()
    this.runMode()
  }
}

module.exports = CreepRole