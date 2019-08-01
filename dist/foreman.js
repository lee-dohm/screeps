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

  reclaimDeadMemory() {
    this.reclaimDeadCreepMemory()
    this.reclaimInaccessibleRoomMemory()
  }

  startShift() {
    debug.log("Begin game loop")

    this.install()
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
