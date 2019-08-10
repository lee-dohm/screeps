"use strict"

const defineProperty = require("./define-property")

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
