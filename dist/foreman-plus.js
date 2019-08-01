const debug = require("./debug")
const HarvesterCreep = require("./harvester-creep")

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
        for (const source of room.sources) {
          if (source.harvestablePositionCount > source.harvesters.keys.length) {
            // Spawn a new harvester
            // Assign the harvester
          }
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
        const creepMemory = Memory.creeps[name]

        if (creepMemory.role === HarvesterCreep.role && creepMemory.target) {
          const sourceMemory = Memory.sources[creepMemory.target]

          if (sourceMemory && sourceMemory.harvesters[name]) {
            delete sourceMemory.harvesters[name]
          }
        }

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
