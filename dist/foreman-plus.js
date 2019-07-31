const debug = require("./debug")

class ForemanPlus {
  install() {
    if (!Memory.foremanPlus || Memory.foremanPlus != this) {
      Memory.foremanPlus = this
    }
  }

  maintainSourceHarvesters() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]

      if (room.hasFriendlySpawns()) {
        const sources = room.sources
        const harvestablePositionCount = sources.reduce((source, total) => source.harvestablePositionCount + total)

        for (const openPosition of openPositions) {
          this.assignHarvester(openPosition)
        }
      }
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
        for (const id of Memory.rooms[name].sources) {
          debug.log(`Delete inaccessible room source from memory: ${name} ${id}`)
          delete Memory.sources[id]
        }

        debug.log(`Delete inaccessible room from memory: ${name}`)
        delete Memory.rooms[name]
      }
    }
  }
}

module.exports = new ForemanPlus()
