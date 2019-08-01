const debug = require("./debug")
const HarvesterCreep = require("./harvester-creep")

class ForemanPlus {
  install() {
    if (!Memory.foremanPlus || Memory.foremanPlus != this) {
      Memory.foremanPlus = this
    }
  }

  reclaimDeadMemory() {
    this.reclaimDeadCreepMemory()
    this.reclaimInaccessibleRoomMemory()
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

module.exports = new ForemanPlus()
