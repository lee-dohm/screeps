"use strict"

const defineProperty = require("./define-property")
const Road = require("./road")

Object.defineProperty(
  Room.prototype,
  "exits",
  defineProperty({
    get: function() {
      if (!this._exits) {
        if (!this.memory.exits) {
          this.memory.exits = {}

          this.memory.exits[TOP] = this.find(FIND_EXIT_TOP).sort((a, b) => (a.x < b.x ? -1 : 1))
          this.memory.exits[RIGHT] = this.find(FIND_EXIT_RIGHT).sort((a, b) => (a.y < b.y ? -1 : 1))
          this.memory.exits[BOTTOM] = this.find(FIND_EXIT_BOTTOM).sort((a, b) =>
            a.x > b.x ? -1 : 1
          )
          this.memory.exits[LEFT] = this.find(FIND_EXIT_LEFT).sort((a, b) => (a.y > b.y ? -1 : 1))
        }

        this._exits = {}
        for (const key of Object.keys(this.memory.exits)) {
          this._exits[key] = this.memory.exits[key].map(
            pos => new RoomPosition(pos.x, pos.y, pos.roomName)
          )
        }
      }

      return this._exits
    }
  })
)

/**
 * This is my room if the room controller is mine.
 */
Object.defineProperty(
  Room.prototype,
  "my",
  defineProperty({
    get: function() {
      if (!this._my) {
        this._my = this.controller && this.controller.my
      }

      return this._my
    }
  })
)

/**
 * The owner of the room is the owner of the room controller.
 */
Object.defineProperty(
  Room.prototype,
  "owner",
  defineProperty({
    get: function() {
      if (!this._owner) {
        this._owner = this.controller && this.controller.owner
      }

      return this._owner
    }
  })
)

/**
 * List of roads in the room.
 */
Object.defineProperty(
  Room.prototype,
  "roads",
  defineProperty({
    get: function() {
      if (!this._roads) {
        if (!this.memory.roads) {
          this.memory.roads = []
        }

        this._roads = this.memory.roads.map(obj => Road.deserialize(obj))
      }

      return this._roads
    },

    set: function(newRoads) {
      this.memory.roads = newRoads.map(road => road.serialize())
      this._roads = newRoads
    }
  })
)

/**
 * List of sources in the room.
 */
Object.defineProperty(
  Room.prototype,
  "sources",
  defineProperty({
    get: function() {
      if (!this._sources) {
        if (!this.memory.sources) {
          this.memory.sources = this.find(FIND_SOURCES).map(source => source.id)
        }

        this._sources = this.memory.sources.map(id => Game.getObjectById(id))
      }

      return this._sources
    }
  })
)

/**
 * Activates safe mode in the room if it is available.
 */
Room.prototype.activateSafeMode = function() {
  if (this.my) {
    this.controller.activateSafeMode()
  }
}

/**
 * Add a road from point `a` to point `b` in the room.
 *
 * The parameters can be `RoomPosition` objects or anything that has a `RoomPosition`.
 */
Room.prototype.addRoad = function(a, b) {
  const road = new Road(a, b)
  road.pave()

  this.roads = this.roads.concat([road])
}

/**
 * Gets the count of extensions in the room.
 *
 * ## Options
 *
 * * `includeConstructionSites` - If set to `true`, then extension construction sites are included
 * in the count. Otherwise, only built extensions are counted. Default is `false`.
 */
Room.prototype.getExtensionCount = function(opts = {}) {
  const extensionFilter = structure => structure.structureType == STRUCTURE_EXTENSION

  let count = this.find(FIND_MY_STRUCTURES, { filter: extensionFilter }).length

  if (opts.includeConstructionSites) {
    count += this.find(FIND_MY_CONSTRUCTION_SITES, { filter: extensionFilter }).length
  }

  return count
}

/**
 * Calculates the maximum amount of energy that can be used to spawn a creep in this room.
 */
Room.prototype.getMaxSpawnEnergy = function() {
  const structures = this.find(FIND_STRUCTURES, {
    filter: structure =>
      structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION
  })

  return structures.reduce((total, structure) => total + structure.energyCapacity, 0)
}

/**
 * Determines whether the room has friendly spawns.
 */
Room.prototype.hasFriendlySpawns = function() {
  return this.find(FIND_MY_SPAWNS).length > 0
}

/**
 * Determines if this room has a road between `a` and `b`.
 */
Room.prototype.hasRoad = function(a, b) {
  const road = new Road(a, b)

  return this.roads.find(other => Road.equals(road, other)) ? true : false
}
