const Body = require("./body")
const debug = require("./debug")
const HarvesterRole = require("./harvester-role")
const names = require("./names")
const roleFactory = require("./role-factory")
const UpgraderRole = require("./upgrader-role")
const watcher = require("./watch-client")

/**
 * Handles the high-level functions of the robot army.
 */
class Foreman {
  /*
   *
   * Section: Game loop
   *
   */

  /**
   * Runs cleanup at the end of the game loop.
   */
  endShift() {
    debug.logStats()
    watcher()
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
    this.maintainUpgraders()
    this.maintainHarvesters()
  }

  /**
   * Maintain the appropriate number of harvester creeps.
   */
  maintainHarvesters() {
    const creeps = this.filterCreeps(creep => creep.role instanceof HarvesterRole)

    if (creeps.length < 3) {
      const spawn = Game.spawns["Spawn1"]
      const maxEnergy = spawn.room.getMaxSpawnEnergy()
      const body = this.getBestBody(HarvesterRole.bodyDefinitions, maxEnergy)

      if (!spawn.spawning) {
        spawn.spawnCreep(body, this.getCreepName(HarvesterRole.id), {
          memory: { roleId: HarvesterRole.id }
        })
      }
    }
  }

  /**
   * Maintain the appropriate number of upgrader creeps
   */
  maintainUpgraders() {
    const creeps = this.filterCreeps(creep => creep.role instanceof UpgraderRole)

    if (creeps.length < 3) {
      const spawn = Game.spawns["Spawn1"]
      const maxEnergy = spawn.room.getMaxSpawnEnergy()
      const body = this.getBestBody(UpgraderRole.bodyDefinitions, maxEnergy)

      if (!spawn.spawning) {
        spawn.spawnCreep(body, this.getCreepName(UpgraderRole.id), {
          memory: { roleId: UpgraderRole.id }
        })
      }
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

  /*
   *
   * Section: Command-line helpers
   *
   */

  /**
   * Lists all creeps.
   *
   * If a `role` is given, lists only creeps of that `role`.
   */
  listCreeps(role) {
    let creeps = Object.keys(Game.creeps).map(name => Game.creeps[name])

    if (role) {
      creeps = creeps.filter(creep => creep.role instanceof role)
    }

    return creeps
  }

  /*
   *
   * Section: Private functions
   *
   */

  filterCreeps(fn) {
    return Object.keys(Game.creeps)
      .map(name => Game.creeps[name])
      .filter(fn)
  }

  getBestBody(definitions, energy) {
    const possibleBodies = definitions.filter(parts => {
      const body = new Body(parts)

      return energy > body.getCost()
    })

    debug.log(`Harvester bodies: ${JSON.stringify(HarvesterRole.bodyDefinitions)}`)
    debug.log(`Possible bodies: ${JSON.stringify(possibleBodies)}`)

    return possibleBodies.sort((a, b) => {
      const bodyA = new Body(a)
      const bodyB = new Body(b)

      return bodyA.getCost() - bodyB.getCost()
    })[0]
  }

  getCreepName(roleId) {
    return `${roleId} ${names.getName()}`
  }

  install() {
    global.foreman = this
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
