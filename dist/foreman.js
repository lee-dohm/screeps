"use strict"

const Body = require("./body")
const BootstrapHarvesterRole = require("./bootstrap-harvester-role")
const BuilderRole = require("./builder-role")
const debug = require("./debug")
const extension = require("./extension")
const HarvesterRole = require("./harvester-role")
const names = require("./names")
const SoldierRole = require("./soldier-role")
const Status = require("./status")
const UpgraderRole = require("./upgrader-role")
const utils = require("./utils")
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
   * Spawns a simple harvester if all the creeps are dead and the main spawn isn't spawning
   * anything else.
   */
  emergencyBootstrap() {
    const spawn = Object.values(Game.spawns)[0]

    if (!spawn.spawning && Object.values(Game.creeps).length === 0) {
      const body = BootstrapHarvesterRole.bodyDefinitions[0]

      spawn.spawnCreep(body, this.getCreepName(BootstrapHarvesterRole.id), {
        memory: { roleId: BootstrapHarvesterRole.id }
      })
    }
  }

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
   * Handle invaders in my rooms.
   */
  handleInvaders() {
    for (const room in Object.values(Game.rooms)) {
      if (room.my) {
        const hostileCreeps = room.find(FIND_HOSTILE_CREEPS)

        if (hostileCreeps.length > 0) {
          room.activateSafeMode()

          const spawns = room.find(FIND_MY_SPAWNS)
          if (spawns.length > 0) {
            const spawn = spawns[0]

            for (let i = SoldierRole.bodyDefinitions.length - 1; i > -1; i--) {
              const definition = SoldierRole.bodyDefinitions[i]

              if (
                spawn.spawnCreep(definition, this.getCreepName(SoldierRole.id), {
                  memory: { roleId: SoldierRole.id }
                }) == OK
              ) {
                break
              }
            }
          }
        }
      }
    }
  }

  /**
   * Maintains the appropriate number of creeps by role.
   *
   * The creep roles are in order from lowest priority to highest because later commands to the
   * same creep or structure in the same tick override earlier commands.
   */
  maintainCreeps() {
    this.maintainRole(BuilderRole, 3)
    this.maintainRole(UpgraderRole, 3)
    this.maintainRole(HarvesterRole, 3)
    this.emergencyBootstrap()
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

  paveAroundExtensions() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]

      if (room.my) {
        const extensions = room.find(FIND_MY_STRUCTURES, {
          filter: struct => struct.structureType == STRUCTURE_EXTENSION
        })

        for (const extension of extensions) {
          for (const pos of extension.pos.getAdjacent()) {
            if (pos.terrain === "swamp" && pos.isWalkable()) {
              const contents = pos.look()
              const found = contents.find(obj => {
                return (
                  (obj.type == LOOK_CONSTRUCTION_SITES &&
                    obj.constructionSite.structureType == STRUCTURE_ROAD) ||
                  (obj.type == LOOK_STRUCTURES && obj.structure.structureType == STRUCTURE_ROAD)
                )
              })

              if (!found) {
                pos.createConstructionSite(STRUCTURE_ROAD)
              }
            }
          }
        }
      }
    }
  }

  paveHarvestablePositions() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]
      const controller = room.controller

      if (controller && controller.my) {
        for (const source of room.sources) {
          const positions = source.getHarvestablePositions()

          for (const pos of positions) {
            if (pos.terrain === "swamp") {
              const roadConstructionSites = pos.constructionSites.filter(
                site => site.structureType == STRUCTURE_ROAD
              )
              const roadStructures = pos.structures.filter(
                struct => struct.structureType == STRUCTURE_ROAD
              )

              if (roadConstructionSites.length == 0 && roadStructures.length == 0) {
                pos.createConstructionSite(STRUCTURE_ROAD)
              }
            }
          }
        }
      }
    }
  }

  plotExtensions() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]
      const controller = room.controller

      if (controller && controller.my) {
        const maxExtensions = this.getMaxStructByRcl(STRUCTURE_EXTENSION, controller.level)
        const currentOrPlannedExtensions = room.getExtensionCount({
          includeConstructionSites: true
        })

        if (currentOrPlannedExtensions < maxExtensions) {
          const spawn = room.find(FIND_MY_SPAWNS)[0]
          const pos = extension.generatePos(room, spawn.pos)

          room.createConstructionSite(pos, STRUCTURE_EXTENSION)
        }
      }
    }
  }

  plotRoads() {
    for (const name in Game.rooms) {
      const room = Game.rooms[name]

      if (room.my) {
        this.plotSourceToControllerRoads(room)
        this.plotSourceToSpawnRoads(room)
      }
    }
  }

  plotSourceToControllerRoads(room) {
    for (const source of room.sources) {
      const controller = room.controller

      if (!room.hasRoad(source, controller)) {
        room.addRoad(source, controller)
      }
    }
  }

  plotSourceToSpawnRoads(room) {
    for (const source of room.sources) {
      const spawns = room.find(FIND_MY_SPAWNS)

      for (const spawn of spawns) {
        if (!room.hasRoad(source, spawn)) {
          room.addRoad(source, spawn)
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
      console.log(creep.status)
    }
  }

  showStatus() {
    const status = new Status()

    status.log()
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

      return energy >= body.getCost()
    })

    return possibleBodies.sort((a, b) => {
      const bodyA = new Body(a)
      const bodyB = new Body(b)

      return bodyB.getCost() - bodyA.getCost()
    })[0]
  }

  getCreepName(roleId) {
    return `${this.capFirst(roleId)} ${this.capFirst(names.getName())}`
  }

  getMaxStructByRcl(structure, level) {
    return CONTROLLER_STRUCTURES[structure][level]
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
