"use strict"

const Body = require("./body")
const debug = require("./debug")
const generateExtensionPos = require("./extension-generator")
const HarvesterRole = require("./harvester-role")
const names = require("./names")
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
    debug.log("-----  End game loop  -----")
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
   * Maintains the appropriate number of creeps by role.
   *
   * The creep roles are in order from lowest priority to highest because later commands to the
   * same creep or structure in the same tick override earlier commands.
   */
  maintainCreeps() {
    this.maintainRole(UpgraderRole, 3)
    this.maintainRole(HarvesterRole, 3)
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

  plotExtensions() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]
      const controller = room.controller

      if (controller && controller.my) {
        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][controller.level]
        const currentOrPlannedExtensions = room.getExtensionCount({
          includeConstructionSites: true
        })

        if (currentOrPlannedExtensions < maxExtensions) {
          if (!global.extensionGenerator) {
            const spawn = room.find(FIND_MY_SPAWNS)[0]
            global.extensionGenerator = generateExtensionPos(room, spawn.pos)
          }

          const pos = global.extensionGenerator().next().value

          room.createConstructionSite(pos, STRUCTURE_EXTENSION)
        }
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
    debug.log("----- Begin game loop -----")

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
   * Disables debug mode.
   */
  disableDebug() {
    delete Memory.debug
  }

  /**
   * Enables debug mode.
   */
  enableDebug() {
    Memory.debug = true
  }

  /**
   * Lists all creeps.
   *
   * If a `role` is given, lists only creeps of that `role`.
   */
  listCreeps(role) {
    let creeps = Object.keys(Game.creeps)
      .map(name => Game.creeps[name])
      .sort((a, b) => (a.name < b.name ? -1 : 1))

    if (role) {
      creeps = creeps.filter(creep => creep.role instanceof role)
    }

    for (const creep of creeps) {
      console.log(`${creep.name} is ${creep.memory.behaviorId} -> ${creep.target}`)
    }
  }

  /*
   *
   * Section: Private functions
   *
   */

  capFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

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

    return possibleBodies.sort((a, b) => {
      const bodyA = new Body(a)
      const bodyB = new Body(b)

      return bodyA.getCost() - bodyB.getCost()
    })[0]
  }

  getCreepName(roleId) {
    return `${this.capFirst(roleId)} ${this.capFirst(names.getName())}`
  }

  install() {
    global.foreman = this
  }

  maintainRole(role, count) {
    const creeps = this.filterCreeps(creep => creep.role instanceof role)

    if (creeps.length < count) {
      const spawn = Game.spawns["Spawn1"]

      this.spawnAt(spawn, role)
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

  spawnAt(spawn, role) {
    if (!spawn.spawning) {
      const maxEnergy = spawn.room.getMaxSpawnEnergy()
      const body = this.getBestBody(role.bodyDefinitions, maxEnergy)

      spawn.spawnCreep(body, this.getCreepName(role.id), {
        memory: { roleId: role.id }
      })
    }
  }
}

module.exports = new Foreman()
