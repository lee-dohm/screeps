const debug = require("./debug")
const HarvesterRole = require("./harvester-role")
const roleFactory = require("./role-factory")
const UpgraderRole = require("./upgrader-role")

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

  maintainCreeps() {
    this.maintainHarvesters()
    this.maintainUpgraders()
  }

  /**
   * Maintain the appropriate number of harvester creeps.
   */
  maintainHarvesters() {
    const creeps = this.filterCreeps(creep => creep.roleId === HarvesterRole.id)

    if (creeps.length < 3) {
      const spawn = Game.spawns["Spawn1"]

      spawn.spawnCreep([WORK, MOVE, MOVE, CARRY], `harvester ${Game.time}`, {
        memory: { roleId: HarvesterRole.id }
      })
    }
  }

  maintainUpgraders() {
    const creeps = this.filterCreeps(creep => creep.roleId === UpgraderRole.id)

    if (creeps.length < 3) {
      const spawn = Game.spawns["Spawn1"]

      spawn.spawnCreep([WORK, MOVE, MOVE, CARRY], `upgrader ${Game.time}`, {
        memory: { roleId: UpgraderRole.id }
      })
    }
  }

  /**
   * Instruct the creeps to perform their actions.
   */
  manageCreeps() {
    for (let name in Game.creeps) {
      try {
        const creep = Game.creeps[name]

        if (creep && !creep.spawning) {
          creep.run()
        }
      } catch (e) {
        debug.logException(e)
      }
    }
  }

  /**
   * Reclaims memory space dedicated to dead or unreachable objects.
   */
  reclaimDeadMemory() {
    this.reclaimDeadCreepMemory()
    this.reclaimInaccessibleRoomMemory()
  }

  /**
   * Initializes everything before the start of the game loop.
   */
  startShift() {
    debug.log("Begin game loop")

    this.install()
  }

  /**
   * Visualizes the creeps' activities.
   */
  visualizeCreeps() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      creep.role.visualize()
    }
  }

  filterCreeps(fn) {
    return Object.keys(Game.creeps)
      .map(name => Game.creeps[name])
      .filter(fn)
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
