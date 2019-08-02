const debug = require("./debug")
const HarvesterCreep = require("./harvester-creep")

class Foreman {
  endShift() {
    debug.logStats()
    debug.log("End game loop")
  }

  killAllCreeps() {
    for (const name in Game.creeps) {
      Game.creeps[name].suicide()
    }
  }

  maintainHarvesters() {
    const creeps = this.filterCreeps(creep => creep.memory.role === HarvesterCreep.role)

    if (creeps.length < 3) {
    }
  }

  reclaimDeadMemory() {
    this.reclaimDeadCreepMemory()
    this.reclaimInaccessibleRoomMemory()
  }

  startShift() {
    debug.log("Begin game loop")

    this.install()
  }

  filterCreeps(fn) {
    let creeps = []

    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      if (fn(creep)) {
        creeps.push(creep)
      }
    }

    return creeps
  }

  install() {
    if (!Memory.foreman || Memory.foreman != this) {
      Memory.foreman = this
    }
  }

  reclaimDeadCreepMemory() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        debug.log(`Delete dead creep from memory: ${name}`)
        delete Memory.creeps[name]
      }
    }
  }

  reclaimInaccessibleRoomMemory() {
    for (const name in Memory.rooms) {
      if (!Game.rooms[name]) {
        debug.log(`Delete inaccessible room from memory: ${name}`)
        delete Memory.rooms[name]
      }
    }
  }
}

module.exports = new Foreman()
