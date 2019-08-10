"use strict"

const defineProperty = require("./define-property")
const Road = require("./road")

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
      this._roads = newRoads
      this.memory.roads = this._roads.map(road => road.serialize())
    }
  })
)

/**
 * Adds a `sources` property to `Room` objects that returns the list of sources in the room.
 *
 * Caches the IDs of the `Source` objects in `Memory` on first access. Caches the `Source` objects
 * in temporary memory on first access within a tick.
 */
Object.defineProperty(
  Room.prototype,
  "sources",
  defineProperty({
    get: function() {
      if (!this._sources) {
        if (!this.memory.sources) {
          const sources = this.find(FIND_SOURCES)
          const sourceIds = sources.map(source => source.id)

          this.memory.sources = sourceIds
        }

        const sourceMap = this.memory.sources.reduce((map, sourceId) => {
          map[sourceId] = Game.getObjectById(sourceId)

          return map
        }, {})

        this._sources = sourceMap
      }

      return this._sources
    }
  })
)

Room.prototype.addRoad = function(a, b) {
  const road = new Road(a, b)
  road.pave()

  this.roads.push(road)
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
