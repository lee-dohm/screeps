const buildCreep = require("./creep-factory")
const debug = require("./debug")
const HarvesterCreep = require("./harvester-creep")

/**
 * Handles the high-level functions of the robot army.
 */
class Foreman {
  /**
   * Runs cleanup at the end of the game loop.
   */
  endShift() {
    debug.logStats()
    debug.log("End game loop")
  }

  /**
   * Force all creeps in the robot army to suicide.
   */
  killAllCreeps() {
    for (const name in Game.creeps) {
      Game.creeps[name].suicide()
    }
  }

  /**
   * Maintain appropriate harvester levels.
   */
  maintainHarvesters() {
    const creeps = this.filterCreeps(creep => creep.role === HarvesterCreep.role)

    if (creeps.length < 3) {
      Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, MOVE, CARRY], `harvester ${Game.time}`, {
        memory: { role: "harvester" }
      })
    }
  }

  /**
   *
   */
  manageCreeps() {
    for (let name in Game.creeps) {
      try {
        const creep = buildCreep(name)

        if (creep) {
          creep.run()
        }
      } catch (e) {
        debug.logException(e)
      }
    }
  }

  reportCreeps() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      if (creep.target) {
        const visual = new RoomVisual(creep.room.name)

        visual.line(creep.pos, creep.target.pos, { color: "#0f0", lineStyle: "dashed" })
      }
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
    return Object.keys(Game.creeps).map(name => Game.creeps[name]).filter(fn)
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
